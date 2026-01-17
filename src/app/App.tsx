import { useState, useCallback, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { AdminTableView } from './components/AdminTableView';
import { LoginModal } from './components/LoginModal';
import { Incident, AIAnalysisResult, UrgencyLevel, CategoryType } from './types/incident';

const CURRENT_USER_ID = 'user-1';

// Mock AI analysis function
const mockAIAnalysis = async (description: string): Promise<AIAnalysisResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simple keyword-based analysis (mock)
  const text = description.toLowerCase();

  let urgency: UrgencyLevel = 'safe';
  let category: CategoryType = 'other';
  let resources: string[] = [];

  // Determine urgency
  if (text.includes('critical') || text.includes('dying') || text.includes('emergency') || text.includes('urgent')) {
    urgency = 'critical';
  } else if (text.includes('help') || text.includes('need') || text.includes('injured')) {
    urgency = 'medium';
  }

  // Determine category
  if (text.includes('rescue') || text.includes('trapped') || text.includes('stuck')) {
    category = 'rescue';
    resources = ['Rescue Team', 'Fire Department', 'Heavy Equipment'];
  } else if (text.includes('medical') || text.includes('injured') || text.includes('sick') || text.includes('health')) {
    category = 'medical';
    resources = ['Ambulance', 'Medical Team', 'First Aid Kit'];
  } else if (text.includes('food') || text.includes('hungry') || text.includes('water')) {
    category = 'food';
    resources = ['Food Supplies', 'Water', 'Distribution Team'];
  } else if (text.includes('shelter') || text.includes('homeless') || text.includes('housing')) {
    category = 'shelter';
    resources = ['Temporary Housing', 'Blankets', 'Tent'];
  }

  const confidence = Math.floor(Math.random() * 15) + 85; // 85-100%

  return {
    urgency,
    category,
    summary: `AI-detected ${urgency} ${category} situation requiring immediate ${urgency === 'critical' ? 'emergency' : 'standard'} response protocol.`,
    resources,
    confidence,
  };
};

// Sample incidents for the map
const generateRandomLocation = () => ({
  lat: (Math.random() * 160) - 80, // Global Lat
  lng: (Math.random() * 360) - 180, // Global Lng
});

const sampleIncidents: Incident[] = [
  {
    id: '1',
    description: 'Earthquake aftermath in Tokyo',
    urgency: 'critical',
    category: 'rescue',
    summary: 'Building structural integrity compromised',
    resources: ['Rescue Team', 'Engineering Unit'],
    confidence: 95,
    location: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    timestamp: new Date(),
    userId: 'user-2',
  },
  {
    id: '2',
    description: 'Medical emergency in New York',
    urgency: 'medium',
    category: 'medical',
    summary: 'Multiple injuries reported in subway',
    resources: ['Ambulance', 'Paramedics'],
    confidence: 88,
    location: { lat: 40.7128, lng: -74.0060 }, // NYC
    timestamp: new Date(),
    userId: 'user-1',
  },
  {
    id: '3',
    description: 'Flood warning in London',
    urgency: 'safe',
    category: 'shelter',
    summary: 'Thames barrier raised, shelters open',
    resources: ['Volunteers', 'Boats'],
    confidence: 92,
    location: { lat: 51.5074, lng: -0.1278 }, // London
    timestamp: new Date(),
    userId: 'user-2',
  },
  {
    id: '4',
    description: 'Forest fire in Sydney outskirts',
    urgency: 'critical',
    category: 'rescue',
    summary: 'Evacuation order for northern suburbs',
    resources: ['Fire Department', 'Aerial Support'],
    confidence: 90,
    location: { lat: -33.8688, lng: 151.2093 }, // Sydney
    timestamp: new Date(),
    userId: 'user-1',
  },
];

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'detected' | 'denied' | 'unavailable'>('detecting');

  // Get user's geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus('detected');
          console.log('📍 Location detected:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationStatus('denied');
          } else {
            setLocationStatus('unavailable');
          }
          // Fallback to random location
          setUserLocation(generateRandomLocation());
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn('Geolocation not supported');
      setLocationStatus('unavailable');
      setUserLocation(generateRandomLocation());
    }
  }, []);

  // Filter incidents based on role
  const filteredIncidents = useMemo(() => {
    if (isAdmin) return incidents;
    return incidents.filter(i => i.userId === CURRENT_USER_ID);
  }, [incidents, isAdmin]);

  const handleAnalyze = useCallback(async (description: string) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const result = await mockAIAnalysis(description);
      setCurrentAnalysis(result);

      // Add new incident to map
      const newIncident: Incident = {
        id: Date.now().toString(),
        description,
        urgency: result.urgency,
        category: result.category,
        summary: result.summary,
        resources: result.resources,
        confidence: result.confidence,
        location: userLocation || generateRandomLocation(), // Use real location if available
        timestamp: new Date(),
        userId: CURRENT_USER_ID, // Assigned to current user
      };

      setIncidents((prev: Incident[]) => [newIncident, ...prev]);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleIncidentClick = useCallback((incident: Incident) => {
    setSelectedIncident(incident);
    setCurrentAnalysis({
      urgency: incident.urgency,
      category: incident.category,
      summary: incident.summary,
      resources: incident.resources,
      confidence: incident.confidence,
      userId: incident.userId, // Although not strictly in AIAnalysisResult, keeping it clean
    } as any); // Type assertion for now if needed, or better, just pass relevant fields
  }, []);

  // Calculate stats based on FILTERED incidents
  // ... (stats calculation moved below)

  const handleDeleteIncident = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      setIncidents(prev => prev.filter(i => i.id !== id));
      if (selectedIncident?.id === id) {
        setSelectedIncident(null);
      }
    }
  }, [selectedIncident]);

  const handleViewOnMap = useCallback((incident: Incident) => {
    setActiveTab('dashboard');
    setSelectedIncident(incident);
    // Optionally trigger a recenter via state or context if needed, 
    // but `selectedIncident` usually triggers a flyTo if the map listens to it.
    // We'll need to make sure LeafletMapView listens to selectedIncident changes or we can pass a "focus" flag.
    // For now, selecting it is a good start. 
  }, []);

  const handleViewDetails = useCallback((incident: Incident) => {
    // For now, details are sufficiently shown in the map/sidebar, so we'll just select it
    setSelectedIncident(incident);
    // If in admin view, we might want to just show a modal? 
    // For this iteration, let's switch to dashboard to see it on the right panel (if connected).
    // Actually, the request was "View Details". 
    // Let's implement a simple details modal or just reuse the logic.
    // The simplest flow for "View Details" in this app structure is to show it on the Dashboard analysis panel.
    setActiveTab('dashboard');
  }, []);

  // Calculate stats based on FILTERED incidents
  const criticalCount = filteredIncidents.filter((i: Incident) => i.urgency === 'critical').length;
  const mediumCount = filteredIncidents.filter((i: Incident) => i.urgency === 'medium').length;
  const safeCount = filteredIncidents.filter((i: Incident) => i.urgency === 'safe').length;
  const avgConfidence = filteredIncidents.length > 0
    ? Math.round(filteredIncidents.reduce((sum: number, i: Incident) => sum + i.confidence, 0) / filteredIncidents.length)
    : 0;

  const handleLogin = (role: 'user' | 'admin') => {
    setIsAdmin(role === 'admin');
  };

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        onLoginClick={() => setIsLoginModalOpen(true)}
      >
        {activeTab === 'dashboard' ? (
          <DashboardView
            criticalCount={criticalCount}
            mediumCount={mediumCount}
            safeCount={safeCount}
            avgConfidence={avgConfidence}
            incidents={filteredIncidents}
            onIncidentClick={handleIncidentClick}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            currentAnalysis={currentAnalysis}
            locationStatus={locationStatus}
            userLocation={userLocation}
            onLocationUpdate={setUserLocation}
          />
        ) : (
          isAdmin ? (
            <AdminTableView
              incidents={incidents}
              onDelete={handleDeleteIncident}
              onViewOnMap={handleViewOnMap}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <HistoryView incidents={filteredIncidents} />
          )
        )}
      </Layout>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}
