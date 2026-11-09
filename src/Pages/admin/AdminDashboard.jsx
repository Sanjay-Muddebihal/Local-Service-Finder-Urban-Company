import React, { useState, useEffect } from "react";
import {
  Avatar, Badge, Box, Button, Container, Divider, Flex,
  FormControl, FormLabel, Heading, HStack, Input, Modal,
  ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Select, SimpleGrid, Table,
  Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast,
  VStack, AlertDialog, AlertDialogBody, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Tabs, Tab, TabList, TabPanel, TabPanels, Tag,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const API = "/api";
const CATEGORIES = ["Plumbing","Electrical","Cleaning","Carpentry","Painting","AC Repair","Pest Control","Appliance"];
const CITIES     = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad"];
const STATUS_COLOR = { PENDING:"orange", CONFIRMED:"blue", COMPLETED:"green", CANCELLED:"red" };
const DEFAULT_ADMIN_EMAIL = "admin@urbancompany.com";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";

const EMPTY_FORM = { name:"", category:"", city:"", phone:"", password:"", experience:"", price:"", available:true };

export default function AdminDashboard() {
  const navigate   = useNavigate();
  const toast      = useToast();
  const addModal   = useDisclosure();
  const delDialog  = useDisclosure();
  const resetDialog = useDisclosure();
  const cancelRef  = React.useRef();
  const resetCancelRef = React.useRef();

  const [providers, setProviders] = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [users,     setUsers]     = useState([]);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [editId,    setEditId]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [adminInfo, setAdminInfo] = useState(() => JSON.parse(localStorage.getItem("admin_info") || "null"));
  const [adminForm, setAdminForm] = useState({
    email: adminInfo?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [adminLoading, setAdminLoading] = useState(false);

  // Guard: redirect if not admin
  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provRes, bookingRes] = await Promise.all([
          fetch(`${API}/services`),
          fetch(`${API}/bookings`),
        ]);
        if (provRes.ok) {
          setProviders(await provRes.json());
        } else {
          setProviders(JSON.parse(localStorage.getItem("uc_providers") || "[]"));
        }
        if (bookingRes.ok) {
          setBookings(await bookingRes.json());
        } else {
          setBookings(JSON.parse(localStorage.getItem("sf_bookings") || "[]"));
        }
      } catch (error) {
        setProviders(JSON.parse(localStorage.getItem("uc_providers") || "[]"));
        setBookings(JSON.parse(localStorage.getItem("sf_bookings") || "[]"));
      }

      const raw = JSON.parse(localStorage.getItem("lsf_users") || "{}");
      setUsers(Object.values(raw));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (adminInfo) {
      setAdminForm({
        email: adminInfo.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [adminInfo]);

  const saveProviders = (list) => {
    setProviders(list);
    localStorage.setItem("uc_providers", JSON.stringify(list));
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.city || !form.phone) {
      toast({ title: "Fill all required fields", status: "warning", duration: 2000 });
      return;
    }

    const providerPayload = {
      ...form,
      price: Number(form.price),
      available: form.available === "true" || form.available === true,
    };

    try {
      let saved;
      let nextProviders;
      if (editId) {
        if (!providerPayload.password) {
          delete providerPayload.password;
        }
        const res = await fetch(`${API}/services/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(providerPayload),
        });
        saved = await res.json();
        nextProviders = providers.map((p) => (p.id === editId ? saved : p));
        toast({ title: "Provider updated", status: "success", duration: 2000 });
      } else {
        const res = await fetch(`${API}/services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(providerPayload),
        });
        saved = await res.json();
        nextProviders = [...providers, saved];
        toast({ title: "Provider added", status: "success", duration: 2000 });
      }
      saveProviders(nextProviders);
    } catch (error) {
      toast({ title: "Unable to save provider", status: "error", duration: 3000 });
      return;
    }

    setForm(EMPTY_FORM);
    setEditId(null);
    addModal.onClose();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      city: p.city,
      phone: p.phone,
      password: "",
      experience: p.experience,
      price: p.price,
      available: p.available,
    });
    setEditId(p.id);
    addModal.onOpen();
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API}/services/${deleteTarget}`, { method: "DELETE" });
      const updated = providers.filter((p) => p.id !== deleteTarget);
      saveProviders(updated);
      delDialog.onClose();
      toast({ title: "Provider removed", status: "info", duration: 2000 });
    } catch (error) {
      toast({ title: "Unable to delete provider", status: "error", duration: 3000 });
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/bookings/${id}/status?status=${status}`, {
        method: "PATCH",
      });
      const updatedBooking = await res.json();
      const updated = bookings.map((b) => b.id === id ? updatedBooking : b);
      setBookings(updated);
      localStorage.setItem("sf_bookings", JSON.stringify(updated));
      toast({ title: `Booking marked ${status}`, status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Unable to update booking status", status: "error", duration: 3000 });
    }
  };

  const handleAdminSave = async () => {
    if (!adminForm.email) {
      toast({ title: "Admin email is required", status: "warning", duration: 2000 });
      return;
    }
    if (adminForm.password && adminForm.password !== adminForm.confirmPassword) {
      toast({ title: "Passwords do not match", status: "warning", duration: 2000 });
      return;
    }
    if (!adminInfo?.id) {
      toast({ title: "Unable to identify admin", status: "error", duration: 3000 });
      return;
    }

    setAdminLoading(true);
    try {
      const payload = { email: adminForm.email };
      if (adminForm.password) payload.password = adminForm.password;

      const res = await fetch(`${API}/admin/${adminInfo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Update failed");
      }

      const updatedAdmin = await res.json();
      setAdminInfo(updatedAdmin);
      localStorage.setItem("admin_info", JSON.stringify(updatedAdmin));
      setAdminForm({ email: updatedAdmin.email || "", password: "", confirmPassword: "" });
      toast({ title: "Admin credentials updated", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: error.message || "Unable to update admin credentials", status: "error", duration: 3000 });
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminReset = async () => {
    if (!adminInfo?.id) {
      toast({ title: "Unable to identify admin", status: "error", duration: 3000 });
      resetDialog.onClose();
      return;
    }

    setAdminLoading(true);
    try {
      const payload = { 
        email: DEFAULT_ADMIN_EMAIL, 
        password: DEFAULT_ADMIN_PASSWORD 
      };

      const res = await fetch(`${API}/admin/${adminInfo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Reset failed");
      }

      const updatedAdmin = await res.json();
      setAdminInfo(updatedAdmin);
      localStorage.setItem("admin_info", JSON.stringify(updatedAdmin));
      setAdminForm({ email: updatedAdmin.email || "", password: "", confirmPassword: "" });
      toast({ 
        title: "Admin credentials reset to defaults", 
        description: `Email: ${DEFAULT_ADMIN_EMAIL}`,
        status: "success", 
        duration: 3000 
      });
      resetDialog.onClose();
    } catch (error) {
      toast({ title: error.message || "Unable to reset admin credentials", status: "error", duration: 3000 });
    } finally {
      setAdminLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/admin");
  };

  const stats = [
    { label:"Total Providers", value: providers.length,                          icon:"👷", color:"blue"   },
    { label:"Total Bookings",  value: bookings.length,                           icon:"📋", color:"purple" },
    { label:"Active Bookings", value: bookings.filter(b=>["PENDING","CONFIRMED"].includes(b.status)).length, icon:"⏳", color:"orange" },
    { label:"Registered Users",value: users.length,                              icon:"👤", color:"green"  },
  ];

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Top Bar */}
      <Box bg="blackAlpha.900" color="white" px={6} py={4}>
        <Flex maxW="7xl" mx="auto" justify="space-between" align="center">
          <HStack spacing={3}>
            <Text fontSize="xl">🛡️</Text>
            <Heading size="md">Admin Dashboard</Heading>
          </HStack>
          <Button size="sm" colorScheme="red" variant="outline" onClick={handleLogout}>Logout</Button>
        </Flex>
      </Box>

      <Container maxW="7xl" py={8}>
        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          {stats.map((s) => (
            <Box key={s.label} bg="white" borderRadius="xl" p={5} boxShadow="sm" textAlign="center">
              <Text fontSize="2xl">{s.icon}</Text>
              <Text fontSize="3xl" fontWeight="extrabold" color={`${s.color}.500`}>{s.value}</Text>
              <Text fontSize="sm" color="gray.500">{s.label}</Text>
            </Box>
          ))}
        </SimpleGrid>

        <Tabs colorScheme="yellow" variant="enclosed">
          <TabList bg="white" borderRadius="xl" p={1} boxShadow="sm" mb={6}>
            {["👷 Providers", "📋 Bookings", "👤 Users", "⚙️ Settings"].map((t) => (
              <Tab key={t} fontWeight="semibold" borderRadius="lg"
                _selected={{ bg: "blackAlpha.900", color: "white" }}>{t}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {/* ── Providers Tab ── */}
            <TabPanel px={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm" color="gray.700">Service Providers ({providers.length})</Heading>
                <Button size="sm" bg="blackAlpha.900" color="white" _hover={{ bg:"gray.700" }}
                  onClick={() => { setForm(EMPTY_FORM); setEditId(null); addModal.onOpen(); }}>
                  + Add Provider
                </Button>
              </Flex>
              <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
                <Table size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      {["Name","Category","City","Phone","Price","Rating","Status","Actions"].map((h) => (
                        <Th key={h}>{h}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {providers.map((p) => (
                      <Tr key={p.id} _hover={{ bg:"gray.50" }}>
                        <Td fontWeight="semibold">{p.name}</Td>
                        <Td><Tag size="sm" colorScheme="blue">{p.category}</Tag></Td>
                        <Td>{p.city}</Td>
                        <Td>{p.phone}</Td>
                        <Td>₹{p.price}</Td>
                        <Td>⭐ {p.avgRating?.toFixed(1)} ({p.totalRatings})</Td>
                        <Td>
                          <Badge colorScheme={p.available ? "green" : "red"}>
                            {p.available ? "Available" : "Busy"}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="xs" colorScheme="blue" onClick={() => handleEdit(p)}>Edit</Button>
                            <Button size="xs" colorScheme="red"
                              onClick={() => { setDeleteTarget(p.id); delDialog.onOpen(); }}>
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            {/* ── Bookings Tab ── */}
            <TabPanel px={0}>
              <Heading size="sm" color="gray.700" mb={4}>All Bookings ({bookings.length})</Heading>
              {bookings.length === 0 ? (
                <Box textAlign="center" py={16}><Text color="gray.400">No bookings yet.</Text></Box>
              ) : (
                <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
                  <Table size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        {["Customer","Provider","Category","Address","Scheduled","Status","Actions"].map((h) => (
                          <Th key={h}>{h}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bookings.map((b) => (
                        <Tr key={b.id} _hover={{ bg:"gray.50" }}>
                          <Td>
                            <VStack align="flex-start" spacing={0}>
                              <Text fontWeight="semibold" fontSize="xs">{b.customerName}</Text>
                              <Text fontSize="xs" color="gray.500">{b.customerPhone}</Text>
                            </VStack>
                          </Td>
                          <Td fontSize="xs">{b.provider?.name}</Td>
                          <Td><Tag size="sm" colorScheme="blue">{b.provider?.category}</Tag></Td>
                          <Td fontSize="xs" maxW="150px" isTruncated>{b.address}</Td>
                          <Td fontSize="xs">
                            {new Date(b.scheduledAt).toLocaleString("en-IN",{ dateStyle:"short", timeStyle:"short" })}
                          </Td>
                          <Td>
                            <Badge colorScheme={STATUS_COLOR[b.status]}>{b.status}</Badge>
                          </Td>
                          <Td>
                            <Select size="xs" w="120px" value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value)}>
                              {["PENDING","CONFIRMED","COMPLETED","CANCELLED"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </Select>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </TabPanel>

            {/* ── Users Tab ── */}
            <TabPanel px={0}>
              <Heading size="sm" color="gray.700" mb={4}>Registered Users ({users.length})</Heading>
              {users.length === 0 ? (
                <Box textAlign="center" py={16}><Text color="gray.400">No registered users yet.</Text></Box>
              ) : (
                <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
                  <Table size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        {["Avatar","Name","Email","Mobile"].map((h) => <Th key={h}>{h}</Th>)}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((u) => (
                        <Tr key={u.uid} _hover={{ bg:"gray.50" }}>
                          <Td><Avatar size="xs" name={u.name} bg="yellow.400" color="black" /></Td>
                          <Td fontWeight="semibold">{u.name}</Td>
                          <Td>{u.email}</Td>
                          <Td>{u.mobile || "—"}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </TabPanel>

            {/* ── Settings Tab ── */}
            <TabPanel px={0}>
              <Heading size="sm" color="gray.700" mb={4}>Admin Settings</Heading>
              <Box bg="white" borderRadius="xl" boxShadow="sm" p={6} mb={6} maxW="3xl">
                <Text fontSize="sm" color="gray.500" mb={4}>
                  Change the admin username or password for future logins.
                </Text>
                <FormControl mb={4}>
                  <FormLabel fontSize="sm">Admin Email</FormLabel>
                  <Input
                    type="email"
                    value={adminForm.email}
                    placeholder="admin@urbancompany.com"
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    focusBorderColor="yellow.400"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize="sm">New Password</FormLabel>
                  <Input
                    type="password"
                    value={adminForm.password}
                    placeholder="Enter new password"
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    focusBorderColor="yellow.400"
                  />
                </FormControl>
                <FormControl mb={6}>
                  <FormLabel fontSize="sm">Confirm New Password</FormLabel>
                  <Input
                    type="password"
                    value={adminForm.confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                    focusBorderColor="yellow.400"
                  />
                </FormControl>
                <Button
                  bg="blackAlpha.900"
                  color="white"
                  _hover={{ bg: "gray.700" }}
                  onClick={handleAdminSave}
                  isLoading={adminLoading}
                >
                  Save Changes
                </Button>
              </Box>

              <Box bg="white" borderRadius="xl" boxShadow="sm" p={6} mb={6} maxW="3xl" borderLeft="4px solid" borderLeftColor="red.400">
                <Text fontSize="sm" color="gray.500" mb={4}>
                  ⚠️ Reset credentials to default values. This will change your admin email and password immediately.
                </Text>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={resetDialog.onOpen}
                >
                  🔄 Reset Credentials
                </Button>
              </Box>

              <Box bg="gray.50" borderRadius="xl" p={5}>
                <Text fontSize="sm" color="gray.500" mb={2}>Current admin details</Text>
                <Text mb={1}><strong>Email:</strong> {adminInfo?.email || "Not available"}</Text>
                <Text><strong>Admin ID:</strong> {adminInfo?.id || "Unknown"}</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* ── Add/Edit Provider Modal ── */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader bg="blackAlpha.900" color="white" borderTopRadius="2xl">
            {editId ? "✏️ Edit Provider" : "➕ Add Provider"}
          </ModalHeader>
          <ModalCloseButton color="white" top={3} />
          <ModalBody py={5}>
            <VStack spacing={3}>
              {[
                { label:"Full Name *",    key:"name",       type:"text",     ph:"Provider name"   },
                { label:"Phone *",        key:"phone",      type:"tel",      ph:"10-digit number"  },
                { label:"Password",       key:"password",   type:"password",ph:"Set provider password" },
                { label:"Experience",     key:"experience", type:"text",     ph:"e.g. 5 yrs"       },
                { label:"Price (₹/visit)",key:"price",      type:"number",   ph:"e.g. 299"         },
              ].map(({ label, key, type, ph }) => (
                <FormControl key={key} isRequired={label.includes("*")}>
                  <FormLabel fontSize="sm">{label}</FormLabel>
                  <Input type={type} placeholder={ph} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    focusBorderColor="yellow.400" />
                </FormControl>
              ))}
              <FormControl isRequired>
                <FormLabel fontSize="sm">Category *</FormLabel>
                <Select placeholder="Select category" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  focusBorderColor="yellow.400">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">City *</FormLabel>
                <Select placeholder="Select city" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  focusBorderColor="yellow.400">
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Availability</FormLabel>
                <Select value={form.available.toString()}
                  onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                  focusBorderColor="yellow.400">
                  <option value="true">Available</option>
                  <option value="false">Busy</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={addModal.onClose}>Cancel</Button>
            <Button bg="blackAlpha.900" color="white" _hover={{ bg:"gray.700" }} onClick={handleSave}>
              {editId ? "Update" : "Add Provider"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Delete Confirm ── */}
      <AlertDialog isOpen={delDialog.isOpen} leastDestructiveRef={cancelRef} onClose={delDialog.onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontWeight="bold">Delete Provider?</AlertDialogHeader>
            <AlertDialogBody>This action cannot be undone.</AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={delDialog.onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* ── Reset Admin Credentials Confirm ── */}
      <AlertDialog isOpen={resetDialog.isOpen} leastDestructiveRef={resetCancelRef} onClose={resetDialog.onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontWeight="bold">🔄 Reset Admin Credentials?</AlertDialogHeader>
            <AlertDialogBody>
              <VStack align="flex-start" spacing={3}>
                <Text>This will reset your admin credentials to the default values:</Text>
                <Box bg="gray.100" p={3} borderRadius="md" w="100%">
                  <Text fontSize="sm"><strong>Email:</strong> {DEFAULT_ADMIN_EMAIL}</Text>
                  <Text fontSize="sm"><strong>Password:</strong> {DEFAULT_ADMIN_PASSWORD}</Text>
                </Box>
                <Text fontSize="sm" color="red.600">
                  You will need to log in again with these credentials. This action cannot be undone without manual database reset.
                </Text>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={resetCancelRef} onClick={resetDialog.onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleAdminReset} isLoading={adminLoading}>
                Confirm Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
