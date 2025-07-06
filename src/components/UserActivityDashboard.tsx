import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Calendar, User, Shield, Filter, Download, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
  user_profile?: {
    full_name: string;
    email: string;
  };
}

interface UserActivityDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserActivityDashboard = ({ open, onOpenChange }: UserActivityDashboardProps) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (open) {
      fetchActivities();
    }
  }, [open]);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, activityTypeFilter, dateFilter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      // Get user profiles for the activities
      const userIds = [...new Set(data?.map(a => a.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      const activitiesWithProfiles = data?.map(activity => ({
        ...activity,
        user_profile: profiles?.find(p => p.user_id === activity.user_id)
      })) || [];

      setActivities(activitiesWithProfiles);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user_profile?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activityTypeFilter !== "all") {
      filtered = filtered.filter(activity => activity.activity_type === activityTypeFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(activity => 
        new Date(activity.created_at) >= filterDate
      );
    }

    setFilteredActivities(filtered);
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'logout':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'participant_created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'participant_status_changed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'user_invited':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bulk_communication_sent':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'login':
      case 'logout':
        return <User className="h-4 w-4" />;
      case 'participant_created':
      case 'participant_status_changed':
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatActivityDetails = (activityType: string, details: any) => {
    switch (activityType) {
      case 'participant_created':
        return `Created participant ${details?.subject_id || 'N/A'}`;
      case 'participant_status_changed':
        return `Changed ${details?.subject_id || 'participant'} status from ${details?.old_status || 'unknown'} to ${details?.new_status || 'unknown'}`;
      case 'user_invited':
        return `Invited user with role ${details?.role || 'unknown'}`;
      case 'bulk_communication_sent':
        return `Sent message "${details?.subject || 'No subject'}" to ${details?.recipient_count || 0} participants`;
      default:
        return activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const uniqueActivityTypes = [...new Set(activities.map(a => a.activity_type))];

  const activityStats = {
    total: activities.length,
    today: activities.filter(a => 
      new Date(a.created_at).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: activities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.created_at) >= weekAgo;
    }).length,
    uniqueUsers: new Set(activities.map(a => a.user_id)).size
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-studio-surface rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-studio-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-studio-text">{t('activity.dashboard')}</h2>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-studio-text">{activityStats.total}</div>
                  <div className="text-sm text-studio-text-muted">{t('activity.total')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{activityStats.today}</div>
                  <div className="text-sm text-studio-text-muted">{t('activity.today')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{activityStats.thisWeek}</div>
                  <div className="text-sm text-studio-text-muted">{t('activity.week')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{activityStats.uniqueUsers}</div>
                  <div className="text-sm text-studio-text-muted">{t('activity.active.users')}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-4 w-4 text-studio-text-muted" />
                  <Input
                    placeholder={t('activity.search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('activity.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('activity.all.activities')}</SelectItem>
                    {uniqueActivityTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('activity.all.time')}</SelectItem>
                    <SelectItem value="today">{t('activity.today')}</SelectItem>
                    <SelectItem value="week">{t('activity.week')}</SelectItem>
                    <SelectItem value="month">{t('activity.this.month')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={fetchActivities}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t('activity.recent')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-studio-text-muted">{t('activity.loading')}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('activity.user')}</TableHead>
                      <TableHead>{t('activity.activity')}</TableHead>
                      <TableHead>{t('activity.details')}</TableHead>
                      <TableHead>{t('activity.time')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-studio-text">
                              {activity.user_profile?.full_name || t('activity.unknown.user')}
                            </p>
                            <p className="text-sm text-studio-text-muted">
                              {activity.user_profile?.email || activity.user_id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActivityColor(activity.activity_type)}>
                            {getActivityIcon(activity.activity_type)}
                            <span className="ml-1">
                              {activity.activity_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-studio-text">
                            {formatActivityDetails(activity.activity_type, activity.details)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-studio-text-muted">
                            <Calendar className="h-3 w-3" />
                            <span className="text-sm">
                              {new Date(activity.created_at).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {!loading && filteredActivities.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-studio-text-muted">{t('activity.no.found')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserActivityDashboard;