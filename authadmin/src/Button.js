function AdminDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState({
        appointments: [],
        patients: [],
        clinics: [],
        approvedClinics: [],
        pdoctors: [],
        approvedPDoctors: [],
        refdoctors: [],
        approvedRefDoctors: [],
        doctorAvailability: [],
        clinicAvailability: [],
        travelagency: [],
        approvedTravelAgencies: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('appointments');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: '', id: null, name: '', action: '' });
    const [openGroups, setOpenGroups] = useState({});

    // Définir getAuthHeaders en premier car utilisé par fetchData
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No authentication token found');
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    }, []);

    // Définir handleApiError avant fetchData
    const handleApiError = useCallback((error, message) => {
        if (error.message.includes('401')) {
            localStorage.clear();
            window.location.href = 'http://localhost:3020/';
            return;
        }
        toast.error(message, {
            role: 'alert',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: 'colored'
        });
        console.error(message, error);
    }, []);

    // Définir fetchData avant les fonctions qui en dépendent
    const fetchData = useCallback(async (endpoint, key, formatData, params = {}) => {
        try {
            setIsLoading(true);
            const query = new URLSearchParams(params).toString();
            const url = query ? `${endpoint}?${query}` : endpoint;
            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (response.status === 401) {
                handleApiError(new Error('401'), 'Session expirée. Veuillez vous reconnecter.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch ${key} (Status: ${response.status})`);
            }

            const rawData = await response.json();
            const formattedData = formatData(rawData || {});
            setData(prev => ({ ...prev, [key]: formattedData }));
            toast.success(`Found ${formattedData.length} ${key}`, {
                role: 'alert',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: 'colored'
            });
        } catch (error) {
            handleApiError(error, `Error fetching ${key}: ${error.message}`);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [getAuthHeaders, handleApiError]);

    // Définir les fonctions de fetch après fetchData
    const fetchDoctorAvailability = useCallback(() => fetchData(
        'http://localhost:3001/appointment/doctors/allavailability',
        'doctorAvailability',
        data => data.map(item => ({
            id: item._id || 'N/A',
            doctorId: item.doctorId || 'N/A',
            doctorName: item.doctorName || 'Unknown Doctor',
            startTime: item.startTime || new Date().toISOString(),
            endTime: item.endTime || new Date().toISOString(),
            status: item.status || 'N/A',
        }))
    ), [fetchData]);

    const fetchClinicAvailability = useCallback(() => fetchData(
        'http://localhost:3001/appointment/clinics/allavailability',
        'clinicAvailability',
        data => data.map(item => ({
            id: item._id || 'N/A',
            clinicId: item.clinicId || 'N/A',
            clinicName: item.clinicName || 'Unknown Clinic',
            startTime: item.startTime || new Date().toISOString(),
            endTime: item.endTime || new Date().toISOString(),
            status: item.status || 'N/A',
        }))
    ), [fetchData]);

    const fetchAllAppointments = useCallback(() => fetchData(
        'http://localhost:3001/appointment/all',
        'appointments',
        data => data.map(item => ({
            id: item.id || 'N/A',
            patient: {
                id: item.patientId || 'N/A',
                name: item.patientName || item.patientId || 'Unknown Patient',
                email: 'N/A',
            },
            doctor: {
                id: item.pdoctorId || 'N/A',
                name: 'Unknown Doctor',
                speciality: item.operation || 'General',
            },
            date: item.date || new Date().toISOString(),
            status: item.approved ? 'confirmed' : 'pending',
            reason: item.operation || 'Not specified',
            chosenSpeciality: item.operation || 'Not specified',
        }))
    ), [fetchData]);

    const fetchAllPatients = useCallback(() => fetchData(
        'http://localhost:3001/users/patient/getAll',
        'patients',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Patient',
            email: item.email || 'N/A',
            insurance: item.insurance || 'N/A',
            age: item.age || 'N/A',
        }))
    ), [fetchData]);

    const fetchAllClinics = useCallback(() => fetchData(
        'http://localhost:3001/users/clinic/getAll',
        'clinics',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Clinic',
            email: item.email || 'N/A',
            location: item.location || 'N/A',
            clinicType: item.ClinicType || 'N/A',
            approved: item.approved !== undefined ? item.approved : false,
            deployed: item.deployed !== undefined ? item.deployed : false,
            pack: item.pack || 'N/A',
        }))
    ), [fetchData]);

    const fetchApprovedClinics = useCallback(() => fetchData(
        'http://localhost:3001/users/clinic/getApproved',
        'approvedClinics',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Clinic',
            email: item.email || 'N/A',
            location: item.location || 'N/A',
            clinicType: item.ClinicType || 'N/A',
            approved: true,
            deployed: item.deployed !== undefined ? item.deployed : false,
            pack: item.pack || 'N/A',
        }))
    ), [fetchData]);

    const fetchAllPDoctors = useCallback(() => fetchData(
        'http://localhost:3001/users/pdoctor/getAll',
        'pdoctors',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Doctor',
            email: item.email || 'N/A',
            speciality: item.Speciality || 'N/A',
            clinicAffiliation: item.ClinicAffiliation || 'N/A',
            phone: item.Phone && item.Phone !== 0 ? item.Phone : 'N/A',
            medicalLicense: item.MedicalLicense || 'N/A',
            approved: item.approved !== undefined ? item.approved : false,
        }))
    ), [fetchData]);

    const fetchApprovedPDoctors = useCallback(() => fetchData(
        'http://localhost:3001/users/pdoctor/getApproved',
        'approvedPDoctors',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Doctor',
            email: item.email || 'N/A',
            speciality: item.Speciality || 'N/A',
            clinicAffiliation: item.ClinicAffiliation || 'N/A',
            phone: item.Phone && item.Phone !== 0 ? item.Phone : 'N/A',
            medicalLicense: item.MedicalLicense || 'N/A',
            approved: true,
        }))
    ), [fetchData]);

    const fetchAllRefDoctors = useCallback(() => fetchData(
        'http://localhost:3001/users/refdoctor/getAll',
        'refdoctors',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Doctor',
            email: item.email || 'N/A',
            speciality: item.Speciality || 'N/A',
            hospital: item.Hospital || 'N/A',
            phone: item.Phone && item.Phone !== 0 ? item.Phone : 'N/A',
            medicalLicense: item.MedicalLicense || 'N/A',
            approved: item.approved !== undefined ? item.approved : false,
        }))
    ), [fetchData]);

    const fetchApprovedRefDoctors = useCallback(() => fetchData(
        'http://localhost:3001/users/refdoctor/getApproved',
        'approvedRefDoctors',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Doctor',
            email: item.email || 'N/A',
            speciality: item.Speciality || 'N/A',
            hospital: item.Hospital || 'N/A',
            phone: item.Phone && item.Phone !== 0 ? item.Phone : 'N/A',
            medicalLicense: item.MedicalLicense || 'N/A',
            approved: true,
        }))
    ), [fetchData]);

    const fetchAllTravelAgencies = useCallback(() => fetchData(
        'http://localhost:3001/users/travelagency/getAll',
        'travelagency',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Agency',
            email: item.email || 'N/A',
            location: item.location || 'N/A',
            AgencyType: item.AgencyType || 'N/A',
            approved: item.approved !== undefined ? item.approved : false,
        }))
    ), [fetchData]);

    const fetchApprovedTravelAgencies = useCallback(() => fetchData(
        'http://localhost:3001/users/travelagency/getApproved',
        'approvedTravelAgencies',
        data => data.map(item => ({
            id: item._id || 'N/A',
            name: item.name || 'Unknown Agency',
            email: item.email || 'N/A',
            location: item.location || 'N/A',
            AgencyType: item.AgencyType || 'N/A',
            approved: true,
        }))
    ), [fetchData]);

    // Les autres fonctions comme approveClinic, approvePDoctor, etc. restent inchangées
    // ...

    // Mise à jour de fetchFunctions
    const fetchFunctions = {
        appointments: fetchAllAppointments,
        patients: fetchAllPatients,
        clinics: fetchAllClinics,
        approvedClinics: fetchApprovedClinics,
        pdoctors: fetchAllPDoctors,
        approvedPDoctors: fetchApprovedPDoctors,
        refdoctors: fetchAllRefDoctors,
        approvedRefDoctors: fetchApprovedRefDoctors,
        doctorAvailability: fetchDoctorAvailability,
        clinicAvailability: fetchClinicAvailability,
        travelagency: fetchAllTravelAgencies,
        approvedTravelAgencies: fetchApprovedTravelAgencies,
    };

    // Le reste du code (useEffect, fonctions utilitaires, JSX) reste inchangé
    // ...
}