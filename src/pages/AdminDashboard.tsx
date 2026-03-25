import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BarChart3, Settings, LogOut, TrendingUp, DollarSign, GraduationCap, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Overview", icon: BarChart3 },
    { path: "/admin/courses", label: "Courses", icon: BookOpen },
    { path: "/admin/students", label: "Students", icon: Users },
    { path: "/admin/analytics", label: "Analytics", icon: TrendingUp },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      // Get total students
      const { count: totalStudents, error: studentsError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get total courses
      const { count: totalCourses, error: coursesError } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      // Get published courses
      const { count: publishedCourses, error: publishedError } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      // Get total enrollments
      const { count: totalEnrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "completed");

      // Get recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentEnrollments, error: recentError } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "completed")
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Get total revenue (sum of completed enrollments)
      const { data: revenueData, error: revenueError } = await supabase
        .from("enrollments")
        .select(`
          courses (
            price,
            currency
          )
        `)
        .eq("payment_status", "completed");

      let totalRevenue = 0;
      if (revenueData) {
        totalRevenue = revenueData.reduce((sum, enrollment) => {
          return sum + (enrollment.courses?.price || 0);
        }, 0);
      }

      if (studentsError || coursesError || publishedError || enrollmentsError || recentError) {
        console.error("Dashboard stats error:", { studentsError, coursesError, publishedError, enrollmentsError, recentError });
      }

      return {
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        publishedCourses: publishedCourses || 0,
        totalEnrollments: totalEnrollments || 0,
        recentEnrollments: recentEnrollments || 0,
        totalRevenue: totalRevenue || 0,
      };
    },
  });

  // Fetch recent students
  const { data: recentStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ["admin-recent-students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          email,
          full_name,
          created_at,
          onboarding_completed,
          enrollments (
            id,
            payment_status,
            courses (
              title
            )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  // Fetch recent enrollments
  const { data: recentEnrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["admin-recent-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          payment_status,
          created_at,
          profiles (
            full_name,
            email
          ),
          courses (
            title,
            price,
            currency
          )
        `)
        .eq("payment_status", "completed")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await signOut();
  };

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your academy and monitor performance</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : dashboardStats?.totalStudents || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : dashboardStats?.publishedCourses || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : dashboardStats?.totalEnrollments || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Paid enrollments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : formatCurrency(dashboardStats?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                From completed payments
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Students */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentStudents && recentStudents.length > 0 ? (
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{student.full_name || "Anonymous"}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={student.onboarding_completed ? "default" : "secondary"}>
                          {student.onboarding_completed ? "Complete" : "Pending"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(student.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent students</p>
              )}
              <div className="mt-4">
                <Link to="/admin/students">
                  <Button variant="outline" className="w-full">
                    View All Students
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
              <CardDescription>Latest course purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentEnrollmentsData && recentEnrollmentsData.length > 0 ? (
                <div className="space-y-4">
                  {recentEnrollmentsData.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {enrollment.profiles?.full_name || enrollment.profiles?.email || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-500">{enrollment.courses?.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(enrollment.courses?.price || 0, enrollment.courses?.currency)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(enrollment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent enrollments</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/courses">
                <Button className="w-full" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Courses
                </Button>
              </Link>
              <Link to="/admin/students">
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Button>
              </Link>
              <Button className="w-full" variant="outline" onClick={() => window.open('https://supabase.com/dashboard', '_blank')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Database Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
