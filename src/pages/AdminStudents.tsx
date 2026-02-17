import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

interface Student {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  education_level: string | null;
  career_goal: string | null;
  onboarding_completed: boolean;
  created_at: string;
  enrollments?: {
    id: string;
    course_id: string;
    payment_status: string;
    enrollment_date: string;
    courses: {
      title: string;
    };
  }[];
}

const AdminStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: students, isLoading } = useQuery({
    queryKey: ["admin-students", searchTerm, filterStatus],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`
          *,
          enrollments (
            id,
            course_id,
            payment_status,
            enrollment_date,
            courses (
              title
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (filterStatus !== "all") {
        query = query.eq("onboarding_completed", filterStatus === "completed");
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Student[];
    },
  });

  const getEnrollmentStatus = (student: Student) => {
    if (!student.enrollments || student.enrollments.length === 0) {
      return { status: "Not Enrolled", color: "bg-gray-100 text-gray-800" };
    }
    
    const hasPaid = student.enrollments.some(e => e.payment_status === "completed");
    return {
      status: hasPaid ? "Enrolled" : "Pending Payment",
      color: hasPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
    };
  };

  const getTotalEnrollments = (student: Student) => {
    return student.enrollments?.length || 0;
  };

  const exportStudents = () => {
    if (!students) return;
    
    const csv = [
      ["Name", "Email", "Phone", "Education", "Career Goal", "Onboarding", "Enrollments", "Joined Date"],
      ...students.map(student => [
        student.full_name || "N/A",
        student.email,
        student.phone || "N/A",
        student.education_level || "N/A",
        student.career_goal || "N/A",
        student.onboarding_completed ? "Yes" : "No",
        getTotalEnrollments(student),
        new Date(student.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-8">Loading students...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-2">View and manage all students</p>
          </div>
          
          <Button onClick={exportStudents} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onboarding Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students?.filter(s => s.onboarding_completed).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students?.reduce((acc, s) => acc + getTotalEnrollments(s), 0) || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students?.filter(s => !s.onboarding_completed).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Students</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-48">
                <Label htmlFor="status">Onboarding Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({students?.length || 0})</CardTitle>
            <CardDescription>List of all registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => {
                  const enrollmentStatus = getEnrollmentStatus(student);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.full_name || "N/A"}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone || "N/A"}</TableCell>
                      <TableCell>{student.education_level || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={
                          student.onboarding_completed 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }>
                          {student.onboarding_completed ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getTotalEnrollments(student)}</TableCell>
                      <TableCell>
                        <Badge className={enrollmentStatus.color}>
                          {enrollmentStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(student.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {students?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStudents;
