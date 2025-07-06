import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStudy } from "@/contexts/StudyContext";
import { useNavigate } from "react-router-dom";
import { Building, Users, FileText } from "lucide-react";

interface StudySelectorProps {
  userRole: 'investigator' | 'cro-sponsor';
}

const StudySelector = ({ userRole }: StudySelectorProps) => {
  const { t } = useLanguage();
  const { studies, setSelectedStudy } = useStudy();
  const navigate = useNavigate();

  const handleStudySelect = (studyId: string) => {
    const study = studies.find(s => s.id === studyId);
    if (study) {
      setSelectedStudy(study);
      navigate(`/${userRole}`);
    }
  };

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

  const getRoleTitle = () => {
    return userRole === 'investigator' 
      ? t('study.selector.investigator.title')
      : t('study.selector.cro.title');
  };

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-widest text-studio-text mb-2">
            STUDIO
          </h1>
          <h2 className="text-xl font-medium text-studio-text mb-2">
            {getRoleTitle()}
          </h2>
          <p className="text-studio-text-muted text-sm">
            {t('study.selector.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {studies.map((study) => (
            <div 
              key={study.id}
              className="bg-studio-surface border border-studio-border rounded-lg p-4 hover:shadow-md hover:border-studio-accent transition-all duration-200 cursor-pointer"
              onClick={() => handleStudySelect(study.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Building className="h-5 w-5 text-studio-accent" />
                    <span className="text-lg font-medium text-studio-text">
                      {study.name}
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-studio-text-muted mb-1">
                      Protocolo: <span className="font-medium text-studio-text">{study.protocol}</span>
                    </p>
                    <p className="text-sm text-studio-text-muted">
                      Patrocinador: <span className="font-medium text-studio-text">{study.sponsor}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {study.phase}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(study.status)}`}>
                      {t(`study.status.${study.status}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-studio-text-muted">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{study.sites} {t('study.sites')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{study.participants} {t('study.participants')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="min-w-32"
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudySelector;