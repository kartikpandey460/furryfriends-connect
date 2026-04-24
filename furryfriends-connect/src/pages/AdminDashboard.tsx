import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Building, FileText, Plus, Edit, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface DashboardStats {
  totalPets: number;
  totalShelters: number;
  totalRequests: number;
  pendingRequests: number;
  totalUsers: number;
  adminUsers: number;
}

interface RecentRequest {
  _id: string;
  dogName: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  dogId?: { name: string; breed: string };
  shelterId?: { name: string };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  image: string;
  description: string;
  shelterId: string;
  vaccinated: boolean;
  neutered: boolean;
}

interface Shelter {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  dogsCount: number;
  rating: number;
  image: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Pet form state
  const [petForm, setPetForm] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "Male",
    size: "Medium",
    image: "",
    description: "",
    shelterId: "",
    vaccinated: false,
    neutered: false,
  });
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  // Shelter form state
  const [shelterForm, setShelterForm] = useState({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    dogsCount: 0,
    rating: 0,
    image: "",
  });
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, petsRes, sheltersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${user?.token}` }
        }),
        fetch('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${user?.token}` }
        }),
        fetch('http://localhost:5000/api/pets'),
        fetch('http://localhost:5000/api/shelters'),
      ]);

      const [statsData, usersData, petsData, sheltersData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        petsRes.json(),
        sheltersRes.json(),
      ]);

      setStats(statsData.statistics);
      setRecentRequests(statsData.recentRequests);
      setUsers(usersData);
      setPets(petsData);
      setShelters(sheltersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/adoptions/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Request status updated successfully",
        });
        fetchDashboardData();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
        fetchDashboardData();
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchDashboardData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handlePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPet
        ? `http://localhost:5000/api/pets/${editingPet.id}`
        : 'http://localhost:5000/api/pets';
      const method = editingPet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(petForm),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Pet ${editingPet ? 'updated' : 'created'} successfully`,
        });
        setPetForm({
          name: "",
          breed: "",
          age: "",
          gender: "Male",
          size: "Medium",
          image: "",
          description: "",
          shelterId: "",
          vaccinated: false,
          neutered: false,
        });
        setEditingPet(null);
        fetchDashboardData();
      } else {
        throw new Error('Failed to save pet');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pet",
        variant: "destructive",
      });
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pet deleted successfully",
        });
        fetchDashboardData();
      } else {
        throw new Error('Failed to delete pet');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
    }
  };

  const handleShelterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingShelter
        ? `http://localhost:5000/api/shelters/${editingShelter.id}`
        : 'http://localhost:5000/api/shelters';
      const method = editingShelter ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(shelterForm),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Shelter ${editingShelter ? 'updated' : 'created'} successfully`,
        });
        setShelterForm({
          name: "",
          location: "",
          address: "",
          phone: "",
          email: "",
          description: "",
          dogsCount: 0,
          rating: 0,
          image: "",
        });
        setEditingShelter(null);
        fetchDashboardData();
      } else {
        throw new Error('Failed to save shelter');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shelter",
        variant: "destructive",
      });
    }
  };

  const deleteShelter = async (shelterId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shelters/${shelterId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Shelter deleted successfully",
        });
        fetchDashboardData();
      } else {
        throw new Error('Failed to delete shelter');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shelter",
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-4 py-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You need admin privileges to access this page.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="shelters">Shelters</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPets}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Shelters</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalShelters}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Adoption Requests</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRequests}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.pendingRequests} pending
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.adminUsers} admins
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Adoption Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dog</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>{request.dogName}</TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'approved' ? 'default' :
                            request.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select onValueChange={(value) => updateRequestStatus(request._id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>All Adoption Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dog</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>{request.dogName}</TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'approved' ? 'default' :
                            request.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select onValueChange={(value) => updateRequestStatus(request._id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem) => (
                      <TableRow key={userItem._id}>
                        <TableCell>{userItem.name}</TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell>
                          <Select
                            value={userItem.role}
                            onValueChange={(value) => updateUserRole(userItem._id, value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{new Date(userItem.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteUser(userItem._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pets">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pet Management</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Pet
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handlePetSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="petName">Name</Label>
                            <Input
                              id="petName"
                              value={petForm.name}
                              onChange={(e) => setPetForm({...petForm, name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="petBreed">Breed</Label>
                            <Input
                              id="petBreed"
                              value={petForm.breed}
                              onChange={(e) => setPetForm({...petForm, breed: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="petAge">Age</Label>
                            <Input
                              id="petAge"
                              value={petForm.age}
                              onChange={(e) => setPetForm({...petForm, age: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="petGender">Gender</Label>
                            <Select value={petForm.gender} onValueChange={(value) => setPetForm({...petForm, gender: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="petSize">Size</Label>
                            <Select value={petForm.size} onValueChange={(value) => setPetForm({...petForm, size: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="petImage">Image URL</Label>
                          <Input
                            id="petImage"
                            value={petForm.image}
                            onChange={(e) => setPetForm({...petForm, image: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="petDescription">Description</Label>
                          <Textarea
                            id="petDescription"
                            value={petForm.description}
                            onChange={(e) => setPetForm({...petForm, description: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="petShelterId">Shelter ID</Label>
                          <Input
                            id="petShelterId"
                            value={petForm.shelterId}
                            onChange={(e) => setPetForm({...petForm, shelterId: e.target.value})}
                            required
                          />
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={petForm.vaccinated}
                              onChange={(e) => setPetForm({...petForm, vaccinated: e.target.checked})}
                            />
                            Vaccinated
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={petForm.neutered}
                              onChange={(e) => setPetForm({...petForm, neutered: e.target.checked})}
                            />
                            Neutered
                          </label>
                        </div>
                        <Button type="submit">{editingPet ? 'Update Pet' : 'Add Pet'}</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Breed</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pets.map((pet) => (
                        <TableRow key={pet.id}>
                          <TableCell>{pet.name}</TableCell>
                          <TableCell>{pet.breed}</TableCell>
                          <TableCell>{pet.age}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {pet.vaccinated && <Badge variant="secondary">Vaccinated</Badge>}
                              {pet.neutered && <Badge variant="secondary">Neutered</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingPet(pet);
                                  setPetForm({
                                    name: pet.name,
                                    breed: pet.breed,
                                    age: pet.age,
                                    gender: pet.gender,
                                    size: pet.size,
                                    image: pet.image,
                                    description: pet.description,
                                    shelterId: pet.shelterId,
                                    vaccinated: pet.vaccinated,
                                    neutered: pet.neutered,
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deletePet(pet.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shelters">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Shelter Management</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Shelter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingShelter ? 'Edit Shelter' : 'Add New Shelter'}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleShelterSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="shelterName">Name</Label>
                            <Input
                              id="shelterName"
                              value={shelterForm.name}
                              onChange={(e) => setShelterForm({...shelterForm, name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="shelterLocation">Location</Label>
                            <Input
                              id="shelterLocation"
                              value={shelterForm.location}
                              onChange={(e) => setShelterForm({...shelterForm, location: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="shelterAddress">Address</Label>
                          <Input
                            id="shelterAddress"
                            value={shelterForm.address}
                            onChange={(e) => setShelterForm({...shelterForm, address: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="shelterPhone">Phone</Label>
                            <Input
                              id="shelterPhone"
                              value={shelterForm.phone}
                              onChange={(e) => setShelterForm({...shelterForm, phone: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="shelterEmail">Email</Label>
                            <Input
                              id="shelterEmail"
                              type="email"
                              value={shelterForm.email}
                              onChange={(e) => setShelterForm({...shelterForm, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="shelterDescription">Description</Label>
                          <Textarea
                            id="shelterDescription"
                            value={shelterForm.description}
                            onChange={(e) => setShelterForm({...shelterForm, description: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="shelterDogsCount">Dogs Count</Label>
                            <Input
                              id="shelterDogsCount"
                              type="number"
                              value={shelterForm.dogsCount}
                              onChange={(e) => setShelterForm({...shelterForm, dogsCount: parseInt(e.target.value) || 0})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="shelterRating">Rating</Label>
                            <Input
                              id="shelterRating"
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              value={shelterForm.rating}
                              onChange={(e) => setShelterForm({...shelterForm, rating: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="shelterImage">Image URL</Label>
                            <Input
                              id="shelterImage"
                              value={shelterForm.image}
                              onChange={(e) => setShelterForm({...shelterForm, image: e.target.value})}
                            />
                          </div>
                        </div>
                        <Button type="submit">{editingShelter ? 'Update Shelter' : 'Add Shelter'}</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Dogs</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shelters.map((shelter) => (
                        <TableRow key={shelter.id}>
                          <TableCell>{shelter.name}</TableCell>
                          <TableCell>{shelter.location}</TableCell>
                          <TableCell>{shelter.phone}</TableCell>
                          <TableCell>{shelter.dogsCount}</TableCell>
                          <TableCell>{shelter.rating}/5</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingShelter(shelter);
                                  setShelterForm({
                                    name: shelter.name,
                                    location: shelter.location,
                                    address: shelter.address,
                                    phone: shelter.phone,
                                    email: shelter.email,
                                    description: shelter.description,
                                    dogsCount: shelter.dogsCount,
                                    rating: shelter.rating,
                                    image: shelter.image,
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteShelter(shelter.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;