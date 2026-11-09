import React, { useState, useEffect } from "react";
import {
  Avatar, Badge, Box, Button, Container, Divider, Flex,
  FormControl, FormLabel, Heading, HStack, Input, Modal,
  ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Select, SimpleGrid, Tab,
  TabList, TabPanel, TabPanels, Tabs, Tag, Text,
  useDisclosure, useToast, VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const API = "/api";
const STATUS_COLOR = { PENDING:"orange", CONFIRMED:"blue", COMPLETED:"green", CANCELLED:"red" };
const CITIES       = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad"];

export default function ProviderDashboard() {
  const navigate     = useNavigate();
  const toast        = useToast();
  const profileModal = useDisclosure();

  const [providerAuth, setProviderAuth] = useState(null);
  const [provider,     setProvider]     = useState(null);
  const [bookings,     setBookings]     = useState([]);
  const [profileForm,  setProfileForm]  = useState({});

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("provider_auth") || "null");
    if (!auth) { navigate("/provider"); return; }
    setProviderAuth(auth);

    const fetchProviderData = async () => {
      try {
        const [providerRes, bookingRes] = await Promise.all([
          fetch(`${API}/services/${auth.id}`),
          fetch(`${API}/bookings?providerId=${auth.id}`),
        ]);

        if (providerRes.ok) {
          const providerData = await providerRes.json();
          setProvider(providerData);
          setProfileForm(providerData);
        } else {
          const providers = JSON.parse(localStorage.getItem("uc_providers") || "[]");
          const me = providers.find((p) => p.id === auth.id);
          if (me) { setProvider(me); setProfileForm(me); }
        }

        if (bookingRes.ok) {
          setBookings(await bookingRes.json());
        } else {
          const allBookings = JSON.parse(localStorage.getItem("sf_bookings") || "[]");
          setBookings(allBookings.filter((b) => b.provider?.id === auth.id));
        }
      } catch (error) {
        const providers = JSON.parse(localStorage.getItem("uc_providers") || "[]");
        const me = providers.find((p) => p.id === auth.id);
        if (me) { setProvider(me); setProfileForm(me); }
        const allBookings = JSON.parse(localStorage.getItem("sf_bookings") || "[]");
        setBookings(allBookings.filter((b) => b.provider?.id === auth.id));
      }
    };
    fetchProviderData();
  }, [navigate]);

  const saveProvider = async (updated) => {
    try {
      const body = {
        name: updated.name,
        category: updated.category,
        city: updated.city,
        phone: updated.phone,
        experience: updated.experience,
        price: updated.price,
        available: updated.available,
      };

      if (updated.password) {
        body.password = updated.password;
      }

      const res = await fetch(`${API}/services/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const saved = res.ok ? await res.json() : updated;
      setProvider(saved);
      setProfileForm(saved);
      localStorage.setItem("provider_auth", JSON.stringify({ id: saved.id, name: saved.name, phone: saved.phone }));
      return saved;
    } catch (error) {
      const providers = JSON.parse(localStorage.getItem("uc_providers") || "[]");
      const list = providers.map((p) => p.id === updated.id ? updated : p);
      localStorage.setItem("uc_providers", JSON.stringify(list));
      setProvider(updated);
      setProfileForm(updated);
      return updated;
    }
  };

  const handleProfileSave = async () => {
    const updated = await saveProvider({ ...provider, ...profileForm, price: Number(profileForm.price) });
    setProvider(updated);
    setProfileForm(updated);
    profileModal.onClose();
    toast({ title: "Profile updated", status: "success", duration: 2000 });
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`${API}/bookings/${bookingId}/status?status=${status}`, {
        method: "PATCH",
      });
      const updatedBooking = await res.json();
      const updated = bookings.map((b) => b.id === bookingId ? updatedBooking : b);
      setBookings(updated);
      toast({ title: `Booking marked ${status}`, status: "success", duration: 2000 });
    } catch (error) {
      const all = JSON.parse(localStorage.getItem("sf_bookings") || "[]");
      const updated = all.map((b) => b.id === bookingId ? { ...b, status } : b);
      localStorage.setItem("sf_bookings", JSON.stringify(updated));
      setBookings(updated.filter((b) => b.provider?.id === providerAuth?.id));
      toast({ title: `Booking marked ${status}`, status: "warning", duration: 2000 });
    }
  };

  const toggleAvailability = async () => {
    const updated = { ...provider, available: !provider.available };
    await saveProvider(updated);
    toast({
      title: updated.available ? "You are now Available" : "You are now Busy",
      status: updated.available ? "success" : "warning", duration: 2000,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("provider_auth");
    navigate("/provider");
  };

  if (!provider) return null;

  const active    = bookings.filter((b) => ["PENDING","CONFIRMED"].includes(b.status));
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  const stats = [
    { label:"Total Jobs",    value: bookings.length,  icon:"📋", color:"blue"   },
    { label:"Active",        value: active.length,    icon:"⏳", color:"orange" },
    { label:"Completed",     value: completed.length, icon:"✅", color:"green"  },
    { label:"Avg Rating",    value: provider.avgRating?.toFixed(1) || "—", icon:"⭐", color:"yellow" },
  ];

  const BookingRow = ({ b }) => (
    <Box bg="white" borderRadius="xl" boxShadow="sm" p={4} border="1px solid" borderColor="gray.100">
      <Flex justify="space-between" align="flex-start" mb={2}>
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="bold">{b.customerName}</Text>
          <Text fontSize="sm" color="gray.500">📞 {b.customerPhone}</Text>
        </VStack>
        <Badge colorScheme={STATUS_COLOR[b.status]} borderRadius="full" px={3}>{b.status}</Badge>
      </Flex>
      <Divider mb={2} />
      <VStack align="flex-start" spacing={1} fontSize="sm" color="gray.600" mb={3}>
        <Text>📍 {b.address}</Text>
        <Text>📅 {new Date(b.scheduledAt).toLocaleString("en-IN",{ dateStyle:"medium", timeStyle:"short" })}</Text>
        <Text>💰 ₹{b.provider?.price || provider.price}</Text>
        {b.rated && <Text>⭐ Customer rated: {b.ratedStars}★ — "{b.ratingComment}"</Text>}
      </VStack>
      {["PENDING","CONFIRMED"].includes(b.status) && (
        <HStack spacing={2}>
          {b.status === "PENDING" && (
            <Button size="xs" colorScheme="blue" onClick={() => updateBookingStatus(b.id, "CONFIRMED")}>
              Confirm
            </Button>
          )}
          <Button size="xs" colorScheme="green" onClick={() => updateBookingStatus(b.id, "COMPLETED")}>
            Mark Complete
          </Button>
          <Button size="xs" colorScheme="red" variant="outline"
            onClick={() => updateBookingStatus(b.id, "CANCELLED")}>
            Cancel
          </Button>
        </HStack>
      )}
    </Box>
  );

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Top Bar */}
      <Box bg="blackAlpha.900" color="white" px={6} py={4}>
        <Flex maxW="6xl" mx="auto" justify="space-between" align="center">
          <HStack spacing={3}>
            <Avatar size="sm" name={provider.name} bg="yellow.400" color="black" />
            <Box>
              <Heading size="sm">{provider.name}</Heading>
              <Text fontSize="xs" color="gray.400">{provider.category} · {provider.city}</Text>
            </Box>
          </HStack>
          <HStack spacing={3}>
            <Button size="sm" colorScheme={provider.available ? "green" : "red"} variant="outline"
              onClick={toggleAvailability}>
              {provider.available ? "✅ Available" : "🔴 Busy"}
            </Button>
            <Button size="sm" variant="outline" color="white" borderColor="white"
              _hover={{ bg:"whiteAlpha.200" }} onClick={profileModal.onOpen}>
              Edit Profile
            </Button>
            <Button size="sm" colorScheme="red" variant="outline" onClick={handleLogout}>Logout</Button>
          </HStack>
        </Flex>
      </Box>

      <Container maxW="6xl" py={8}>
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

        {/* Profile Summary */}
        <Box bg="white" borderRadius="xl" boxShadow="sm" p={5} mb={8}>
          <Heading size="sm" mb={3} color="gray.700">My Profile</Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} fontSize="sm">
            <HStack><Text>📞</Text><Text>{provider.phone}</Text></HStack>
            <HStack><Text>🏙️</Text><Text>{provider.city}</Text></HStack>
            <HStack><Text>⏱</Text><Text>{provider.experience}</Text></HStack>
            <HStack><Text>💰</Text><Text>₹{provider.price}/visit</Text></HStack>
          </SimpleGrid>
        </Box>

        {/* Bookings Tabs */}
        <Tabs colorScheme="yellow" variant="enclosed">
          <TabList bg="white" borderRadius="xl" p={1} boxShadow="sm" mb={6}>
            {[
              { label:`⏳ Active (${active.length})`,       color:"blackAlpha.900" },
              { label:`✅ Completed (${completed.length})`, color:"green.500"      },
              { label:`❌ Cancelled (${cancelled.length})`, color:"red.500"        },
            ].map((t) => (
              <Tab key={t.label} fontWeight="semibold" borderRadius="lg"
                _selected={{ bg: t.color, color: "white" }}>{t.label}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {[active, completed, cancelled].map((list, i) => (
              <TabPanel key={i} px={0}>
                {list.length === 0 ? (
                  <Box textAlign="center" py={16}>
                    <Text fontSize="4xl" mb={3}>{["📭","🎉","✨"][i]}</Text>
                    <Text color="gray.500">{["No active bookings","No completed jobs yet","No cancelled bookings"][i]}</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base:1, md:2 }} spacing={5}>
                    {list.map((b) => <BookingRow key={b.id} b={b} />)}
                  </SimpleGrid>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>

      {/* Edit Profile Modal */}
      <Modal isOpen={profileModal.isOpen} onClose={profileModal.onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader bg="blackAlpha.900" color="white" borderTopRadius="2xl">✏️ Edit Profile</ModalHeader>
          <ModalCloseButton color="white" top={3} />
          <ModalBody py={5}>
            <VStack spacing={3}>
              {[
                { label:"Full Name",       key:"name",       type:"text",   ph:"Your name"   },
                { label:"Experience",      key:"experience", type:"text",   ph:"e.g. 5 yrs"  },
                { label:"Price (₹/visit)", key:"price",      type:"number", ph:"e.g. 299"    },
              ].map(({ label, key, type, ph }) => (
                <FormControl key={key}>
                  <FormLabel fontSize="sm">{label}</FormLabel>
                  <Input type={type} placeholder={ph} value={profileForm[key] || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                    focusBorderColor="yellow.400" />
                </FormControl>
              ))}
              <FormControl>
                <FormLabel fontSize="sm">City</FormLabel>
                <Select value={profileForm.city || ""} focusBorderColor="yellow.400"
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Availability</FormLabel>
                <Select value={profileForm.available?.toString()}
                  onChange={(e) => setProfileForm({ ...profileForm, available: e.target.value === "true" })}
                  focusBorderColor="yellow.400">
                  <option value="true">Available</option>
                  <option value="false">Busy</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={profileModal.onClose}>Cancel</Button>
            <Button bg="blackAlpha.900" color="white" _hover={{ bg:"gray.700" }} onClick={handleProfileSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
