import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import Index from "./pages/Index";
import TeamManagement from "./pages/TeamManagement";
import NotFound from "./pages/NotFound";
import { TeamMember } from "./types/status";
import { teamMembers as initialTeamMembers } from "./data/mockData";
import {
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  runMigration,
} from "./lib/api";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

function AppContent() {
  const queryClient = useQueryClient();
  const migrationAttempted = useRef(false);

  // Fetch team members from API
  const { data: teamMembers = initialTeamMembers, error } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
  });

  // Auto-run migration when API fails (database not initialized)
  useEffect(() => {
    if (error && !migrationAttempted.current) {
      migrationAttempted.current = true;
      console.log("Database may not be initialized, running migration...");
      runMigration()
        .then((result) => {
          if (result.success) {
            console.log("Migration successful:", result.message);
            // Refetch data after successful migration
            queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
            queryClient.invalidateQueries({ queryKey: ["statuses"] });
          } else {
            console.error("Migration failed:", result);
          }
        })
        .catch((err) => {
          console.error("Migration error:", err);
        });
    }
  }, [error, queryClient]);

  // Mutations for team member operations
  const addMemberMutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (error) => {
      toast.error("Failed to add team member");
      console.error("Add member error:", error);
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<TeamMember, "id"> }) =>
      updateTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (error) => {
      toast.error("Failed to update team member");
      console.error("Update member error:", error);
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (error) => {
      toast.error("Failed to delete team member");
      console.error("Delete member error:", error);
    },
  });

  const handleAddMember = (member: Omit<TeamMember, "id">) => {
    addMemberMutation.mutate(member);
  };

  const handleUpdateMember = (id: string, data: Omit<TeamMember, "id">) => {
    updateMemberMutation.mutate({ id, data });
  };

  const handleDeleteMember = (id: string) => {
    deleteMemberMutation.mutate(id);
  };

  if (error) {
    console.error("Failed to load team members:", error);
  }

  return (
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
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
