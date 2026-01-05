import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TeamManagement from "./pages/TeamManagement";
import NotFound from "./pages/NotFound";
import { TeamMember } from "./types/status";
import { teamMembers as initialTeamMembers } from "./data/mockData";

const queryClient = new QueryClient();

const App = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

  const handleAddMember = (member: Omit<TeamMember, 'id'>) => {
    setTeamMembers(prev => [...prev, { ...member, id: crypto.randomUUID() }]);
  };

  const handleUpdateMember = (id: string, data: Omit<TeamMember, 'id'>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...data, id } : m));
  };

  const handleDeleteMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index teamMembers={teamMembers} />} />
            <Route 
              path="/team" 
              element={
                <TeamManagement 
                  members={teamMembers}
                  onAddMember={handleAddMember}
                  onUpdateMember={handleUpdateMember}
                  onDeleteMember={handleDeleteMember}
                />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
