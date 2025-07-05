import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useStudy } from "@/contexts/StudyContext";
import { ChevronDown, Building, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const StudyDropdown = () => {
  const { selectedStudy, studies, setSelectedStudy } = useStudy();
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-progress-success/10 text-progress-success border-progress-success/20';
      case 'recruiting':
        return 'bg-progress-info/10 text-progress-info border-progress-info/20';
      case 'completed':
        return 'bg-progress-gray/10 text-progress-gray border-progress-gray/20';
      default:
        return 'bg-studio-border text-studio-text-muted';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="max-w-64">
          <div className="flex items-center space-x-2 min-w-0">
            <Building className="h-4 w-4 text-studio-text-muted flex-shrink-0" />
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs text-studio-text-muted truncate">
                {selectedStudy?.protocol}
              </span>
              <span className="text-sm text-studio-text truncate">
                {selectedStudy?.name || 'Select Study'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-studio-text-muted flex-shrink-0" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-studio-surface border-studio-border">
        {studies.map((study) => (
          <DropdownMenuItem
            key={study.id}
            onClick={() => setSelectedStudy(study)}
            className="cursor-pointer p-3 hover:bg-studio-bg"
          >
            <div className="flex flex-col w-full space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-studio-text">{study.protocol}</span>
                {selectedStudy?.id === study.id && (
                  <Badge variant="outline" className="text-xs">Selected</Badge>
                )}
              </div>
              <span className="text-sm text-studio-text-muted">{study.name}</span>
              <span className="text-xs text-studio-text-muted">{study.sponsor}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudyDropdown;