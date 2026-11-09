import React, { useState, useEffect } from "react";
import {
  Avatar, Badge, Box, Button, Container, Divider, Flex,
  FormControl, FormLabel, Grid, Heading, HStack, Input,
  InputGroup, InputLeftElement, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Select, SimpleGrid, Spinner, Tag, Text,
  Textarea, useDisclosure, useToast, VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/AppFooter";
import { StarRating } from "../Components/StarRating";

const API = "/api";

const CATEGORIES = ["Plumbing","Electrical","Cleaning","Carpentry","Painting","AC Repair","Pest Control","Appliance"];
const CITIES     = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad"];
const CAT_ICONS  = {
  Plumbing:"🔧", Electrical:"⚡", Cleaning:"🧹", Carpentry:"🪚",
  Painting:"🎨", "AC Repair":"❄️", "Pest Control":"🐛", Appliance:"🔌",
};

const MOCK_PROVIDERS = [
  { id:1,  name:"Ramesh Kumar",      category:"Plumbing",     city:"Mumbai",    phone:"9876543210", avgRating:4.8, totalRatings:124, available:true,  experience:"8 yrs",  price:299 },
  { id:2,  name:"Suresh Sharma",     category:"Plumbing",     city:"Mumbai",    phone:"9876543211", avgRating:4.5, totalRatings:89,  available:true,  experience:"5 yrs",  price:249 },
  { id:3,  name:"Vijay Electricals", category:"Electrical",   city:"Mumbai",    phone:"9876543212", avgRating:4.9, totalRatings:210, available:false, experience:"10 yrs", price:349 },
  { id:4,  name:"Clean Pro",         category:"Cleaning",     city:"Delhi",     phone:"9876543213", avgRating:4.6, totalRatings:67,  available:true,  experience:"3 yrs",  price:199 },
  { id:5,  name:"Mohan Carpenter",   category:"Carpentry",    city:"Bangalore", phone:"9876543214", avgRating:4.7, totalRatings:45,  available:true,  experience:"12 yrs", price:399 },
  { id:6,  name:"Ravi Painter",      category:"Painting",     city:"Mumbai",    phone:"9876543215", avgRating:4.4, totalRatings:33,  available:true,  experience:"6 yrs",  price:279 },
  { id:7,  name:"Cool Air AC",       category:"AC Repair",    city:"Chennai",   phone:"9876543216", avgRating:4.8, totalRatings:156, available:true,  experience:"9 yrs",  price:449 },
  { id:8,  name:"BugFree Services",  category:"Pest Control", city:"Pune",      phone:"9876543217", avgRating:4.3, totalRatings:28,  available:false, experience:"4 yrs",  price:599 },
  { id:9,  name:"Spark Electric",    category:"Electrical",   city:"Delhi",     phone:"9876543218", avgRating:4.6, totalRatings:92,  available:true,  experience:"7 yrs",  price:329 },
  { id:10, name:"HomeShine Clean",   category:"Cleaning",     city:"Bangalore", phone:"9876543219", avgRating:4.9, totalRatings:178, available:true,  experience:"5 yrs",  price:179 },
  { id:11, name:"AquaFix Plumbing",  category:"Plumbing",     city:"Chennai",   phone:"9876543220", avgRating:4.7, totalRatings:61,  available:true,  experience:"6 yrs",  price:319 },
  { id:12, name:"GadgetFix Pro",     category:"Appliance",    city:"Hyderabad", phone:"9876543221", avgRating:4.5, totalRatings:44,  available:true,  experience:"8 yrs",  price:499 },
];

// ── Provider Card ─────────────────────────────────────────────────────────────
function ProviderCard({ provider, onBook, onRate }) {
  return (
    <Box
      bg="white" borderRadius="xl" boxShadow="md" p={5}
      border="1px solid" borderColor="gray.100"
      transition="all 0.2s"
      _hover={{ boxShadow: "xl", transform: "translateY(-3px)" }}
    >
      <Flex justify="space-between" align="flex-start" mb={3}>
        <HStack spacing={3}>
          <Avatar size="md" name={provider.name} bg="blackAlpha.800" color="yellow.400" />
          <Box>
            <Text fontWeight="bold" fontSize="md">{provider.name}</Text>
            <Text fontSize="xs" color="gray.500">📍 {provider.city}</Text>
          </Box>
        </HStack>
        <Badge colorScheme={provider.available ? "green" : "red"} borderRadius="full" px={2} fontSize="xs">
          {provider.available ? "✅ Available" : "🔴 Busy"}
        </Badge>
      </Flex>

      <HStack spacing={2} mb={3} flexWrap="wrap">
        <Tag colorScheme="blue"  size="sm">{CAT_ICONS[provider.category]} {provider.category}</Tag>
        <Tag colorScheme="gray"  size="sm">⏱ {provider.experience}</Tag>
        <Tag colorScheme="green" size="sm">₹{provider.price}/visit</Tag>
      </HStack>

      <Flex align="center" gap={2} mb={4}>
        <StarRating value={Math.round(provider.avgRating)} readonly size={3} />
        <Text fontSize="sm" fontWeight="bold">{provider.avgRating?.toFixed(1)}</Text>
        <Text fontSize="xs" color="gray.400">({provider.totalRatings} reviews)</Text>
      </Flex>

      <Divider mb={4} />

      <HStack spacing={3}>
        <Button
          flex={1} size="sm" bg="blackAlpha.900" color="white"
          _hover={{ bg: "gray.700" }}
          isDisabled={!provider.available}
          onClick={() => onBook(provider)}
        >
          Book Now
        </Button>
        <Button flex={1} size="sm" variant="outline" colorScheme="yellow" onClick={() => onRate(provider)}>
          Rate ⭐
        </Button>
      </HStack>
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServiceFinder() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const toast     = useToast();
  const { user }  = useSelector((s) => s.AuthReducer);
  const bookModal = useDisclosure();
  const rateModal = useDisclosure();

  const queryCategory = new URLSearchParams(location.search).get("category") || "";

  const [providers, setProviders]   = useState([]);
  const [category, setCategory]     = useState(queryCategory);
  const [city, setCity]             = useState("");
  const [search, setSearch]         = useState("");
  const [sortBy, setSortBy]         = useState("rating");
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [ratingStars, setRatingStars]     = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [booking, setBooking] = useState({
    customerName: user?.name || "",
    customerPhone: user?.phone || "",
    address: "",
    scheduledAt: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    method: "CARD",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });
  const [upiAuthorized, setUpiAuthorized] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const closeBookingModal = () => {
    bookModal.onClose();
    setUpiAuthorized(false);
    setPaymentInfo((prev) => ({ ...prev, method: "CARD" }));
  };

  // Pre-fill booking form when user changes
  useEffect(() => {
    setBooking((b) => ({ ...b, customerName: user?.name || "", customerPhone: user?.phone || "" }));
  }, [user]);

  // Update category from URL param
  useEffect(() => { setCategory(queryCategory); }, [queryCategory]);

  // Auto-fetch all providers on page load
  useEffect(() => {
    fetchProviders();
  }, []);

  // Fetch all providers from backend, fall back to mock
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/services`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        setProviders(data.length > 0 ? data : MOCK_PROVIDERS);
      } else {
        setProviders(MOCK_PROVIDERS);
      }
    } catch (_) {
      setProviders(MOCK_PROVIDERS);
    }
    setLoading(false);
  };

  // Filtered + sorted list
  const filtered = providers
    .filter((p) => !category || p.category.toLowerCase() === category.toLowerCase())
    .filter((p) => !city     || p.city.toLowerCase() === city.toLowerCase())
    .filter((p) => !search   ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return (b.avgRating || 0) - (a.avgRating || 0);
      if (sortBy === "price")  return (a.price || 0) - (b.price || 0);
      if (sortBy === "reviews") return (b.totalRatings || 0) - (a.totalRatings || 0);
      return 0;
    });

  // Search button — re-fetch with filters
  const fetchBackend = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (city)     params.append("city", city);
      const res = await fetch(`${API}/services?${params}`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        setProviders(data.length > 0 ? data : MOCK_PROVIDERS);
      }
    } catch (_) {}
    setLoading(false);
  };

  const handleBook = async () => {
    const { customerName, customerPhone, address, scheduledAt } = booking;
    const { method, cardName, cardNumber, expiry, cvv, upiId, bankName, accountNumber } = paymentInfo;
    if (!customerName || !customerPhone || !address || !scheduledAt) {
      toast({ title: "Please fill all fields", status: "warning", duration: 2000, position: "top" });
      return;
    }
    if (!method) {
      toast({ title: "Select a payment method", status: "warning", duration: 2000, position: "top" });
      return;
    }
    if (method === "CARD") {
      if (!cardName || !cardNumber || !expiry || !cvv) {
        toast({ title: "Please complete payment details", status: "warning", duration: 2000, position: "top" });
        return;
      }
      if (cardNumber.replace(/\D/g, "").length < 12) {
        toast({ title: "Enter a valid card number", status: "warning", duration: 2000, position: "top" });
        return;
      }
    }
    if (method === "UPI") {
      if (!upiId) {
        toast({ title: "Enter your UPI ID", status: "warning", duration: 2000, position: "top" });
        return;
      }
      if (!upiAuthorized) {
        toast({ title: "Complete UPI authorization", status: "warning", duration: 2000, position: "top" });
        return;
      }
    }
    if (method === "NETBANKING" && (!bankName || !accountNumber)) {
      toast({ title: "Enter netbanking details", status: "warning", duration: 2000, position: "top" });
      return;
    }

    const amount = Number(selected?.price || 0) + 49;
    setPaymentLoading(true);
    let transaction;

    try {
      const paymentRes = await fetch(`${API}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          paymentMethod: method,
          cardHolderName: cardName,
          cardNumber,
          expiry,
          cvv,
          upiId,
          bankName,
          accountNumber,
          ifsc: paymentInfo.ifsc,
          customerName,
          customerPhone,
          providerId: selected.id,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!paymentRes.ok) {
        const err = await paymentRes.text();
        throw new Error(err || "Payment failed");
      }
      const paymentData = await paymentRes.json();
      transaction = paymentData.transactionId;

      const res = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          provider: { id: selected.id },
          paymentTransactionId: transaction,
          paymentMethod: method,
          amount,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Booking failed");
      }
      const saved = await res.json();

      const localBooking = {
        id: saved.id,
        ...booking,
        provider: selected,
        status: saved.status,
        createdAt: saved.createdAt,
        paymentTransactionId: transaction,
        paymentMethod: method,
      };
      const existing = JSON.parse(localStorage.getItem("sf_bookings") || "[]");
      localStorage.setItem("sf_bookings", JSON.stringify([...existing, localBooking]));

      closeBookingModal();
      setBooking({ customerName: user?.name || "", customerPhone: user?.phone || "", address: "", scheduledAt: "" });
      setPaymentInfo({ method: "CARD", cardName: "", cardNumber: "", expiry: "", cvv: "", upiId: "", bankName: "", accountNumber: "", ifsc: "" });
      toast({
        title: method === "COD" ? "Booking confirmed on cash payment" : "🎉 Payment completed and booking confirmed!",
        description: method === "COD"
          ? `A provider will contact you soon and you can pay in cash after service.`
          : `Transaction ${transaction}. ${selected.name} will contact you soon.`,
        status: "success",
        duration: 6000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({ title: error.message || "Unable to complete booking", status: "error", duration: 3000, position: "top" });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRate = async () => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === selected.id
          ? {
              ...p,
              avgRating: parseFloat(((p.avgRating * p.totalRatings + ratingStars) / (p.totalRatings + 1)).toFixed(1)),
              totalRatings: p.totalRatings + 1,
            }
          : p
      )
    );

    try {
      await fetch(`${API}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars: ratingStars, comment: ratingComment, provider: { id: selected.id } }),
        signal: AbortSignal.timeout(3000),
      });
      await fetchProviders();
    } catch (_) {
      // fallback local update already applied
    }

    rateModal.onClose();
    setRatingStars(5);
    setRatingComment("");
    toast({ title: "⭐ Rating Submitted! Thank you.", status: "success", duration: 2000, position: "top" });
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      {/* Page Header */}
      <Box bg="blackAlpha.900" color="white" py={10} px={4}>
        <Container maxW="6xl">
          <Heading size="xl" mb={1}>Find Local Services</Heading>
          <Text color="gray.400">Search from {providers.length} verified professionals near you</Text>
        </Container>
      </Box>

      <Container maxW="6xl" py={8}>

        {/* ── Search & Filter Bar ── */}
        <Box bg="white" borderRadius="xl" p={5} boxShadow="md" mb={8}>
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr auto" }} gap={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
              <Input
                placeholder="Search by name, service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                focusBorderColor="yellow.400"
              />
            </InputGroup>
            <Select placeholder="All Categories" value={category} onChange={(e) => setCategory(e.target.value)} focusBorderColor="yellow.400">
              {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
            </Select>
            <Select placeholder="All Cities" value={city} onChange={(e) => setCity(e.target.value)} focusBorderColor="yellow.400">
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} focusBorderColor="yellow.400">
              <option value="rating">Sort: Top Rated</option>
              <option value="price">Sort: Lowest Price</option>
              <option value="reviews">Sort: Most Reviews</option>
            </Select>
            <Button bg="blackAlpha.900" color="white" px={6} _hover={{ bg: "gray.700" }}
              onClick={fetchBackend} isLoading={loading}>
              Search
            </Button>
          </Grid>

          {/* Active filter tags */}
          {(category || city) && (
            <HStack mt={3} spacing={2} flexWrap="wrap">
              <Text fontSize="sm" color="gray.500">Filters:</Text>
              {category && <Tag colorScheme="blue"  size="sm" cursor="pointer" onClick={() => setCategory("")}>{category} ✕</Tag>}
              {city     && <Tag colorScheme="green" size="sm" cursor="pointer" onClick={() => setCity("")}>{city} ✕</Tag>}
            </HStack>
          )}
        </Box>

        {/* ── Category Quick Filters ── */}
        <HStack spacing={3} mb={6} overflowX="auto" pb={2}>
          <Button
            size="sm" borderRadius="full"
            bg={!category ? "blackAlpha.900" : "white"}
            color={!category ? "white" : "gray.700"}
            border="1px solid" borderColor="gray.200"
            _hover={{ bg: "blackAlpha.800", color: "white" }}
            onClick={() => setCategory("")}
          >
            All
          </Button>
          {CATEGORIES.map((c) => (
            <Button
              key={c} size="sm" borderRadius="full" whiteSpace="nowrap"
              bg={category === c ? "blackAlpha.900" : "white"}
              color={category === c ? "white" : "gray.700"}
              border="1px solid" borderColor="gray.200"
              _hover={{ bg: "blackAlpha.800", color: "white" }}
              onClick={() => setCategory(c)}
            >
              {CAT_ICONS[c]} {c}
            </Button>
          ))}
        </HStack>

        {/* ── Results count ── */}
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="semibold" color="gray.600">
            {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
            {category ? ` for "${category}"` : ""}
            {city ? ` in ${city}` : ""}
          </Text>
          <Button size="sm" variant="link" colorScheme="blue" onClick={() => navigate("/my-bookings")}>
            View My Bookings →
          </Button>
        </Flex>

        {/* ── Provider Grid ── */}
        {loading ? (
          <Flex justify="center" py={20}><Spinner size="xl" color="yellow.400" thickness="4px" /></Flex>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={20}>
            <Text fontSize="5xl" mb={4}>🔍</Text>
            <Heading size="md" mb={2} color="gray.600">No providers found</Heading>
            <Text color="gray.500" mb={4}>Try changing your filters or search term</Text>
            <Button bg="blackAlpha.900" color="white" onClick={() => { setCategory(""); setCity(""); setSearch(""); }}>
              Clear Filters
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
            {filtered.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                onBook={(prov) => { setSelected(prov); bookModal.onOpen(); }}
                onRate={(prov) => { setSelected(prov); rateModal.onOpen(); }}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>

      {/* ── Booking Modal ── */}
      <Modal isOpen={bookModal.isOpen} onClose={closeBookingModal} size="md" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader bg="blackAlpha.900" color="white" borderTopRadius="2xl" py={4}>
            📅 Book {selected?.name}
          </ModalHeader>
          <ModalCloseButton color="white" top={3} />
          <ModalBody py={6}>
            <VStack spacing={4}>
              {/* Provider summary */}
              <Box w="100%" p={3} bg="yellow.50" borderRadius="lg" border="1px solid" borderColor="yellow.200">
                <HStack justify="space-between">
                  <HStack>
                    <Text fontSize="2xl">{CAT_ICONS[selected?.category]}</Text>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">{selected?.name}</Text>
                      <Text fontSize="xs" color="gray.500">{selected?.category} · {selected?.experience}</Text>
                    </Box>
                  </HStack>
                  <Box textAlign="right">
                    <Text fontWeight="bold" color="green.600">₹{selected?.price}</Text>
                    <Text fontSize="xs" color="gray.500">per visit</Text>
                  </Box>
                </HStack>
              </Box>

              {/* Provider Contact */}
              <Box w="100%" p={3} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.100">
                <Text fontSize="xs" fontWeight="bold" color="blue.600" textTransform="uppercase" letterSpacing="wider" mb={2}>
                  📞 Provider Contact Details
                </Text>
                <SimpleGrid columns={2} spacing={2} fontSize="sm">
                  <HStack>
                    <Text>🧑🔧</Text>
                    <Text fontWeight="semibold">{selected?.name}</Text>
                  </HStack>
                  <HStack>
                    <Text>📞</Text>
                    <Text
                      as="a"
                      href={`tel:${selected?.phone}`}
                      color="blue.600"
                      fontWeight="bold"
                      _hover={{ textDecoration: "underline" }}
                    >
                      {selected?.phone}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text>🏙️</Text>
                    <Text color="gray.600">{selected?.city}</Text>
                  </HStack>
                  <HStack>
                    <Text>⭐</Text>
                    <Text color="gray.600">{selected?.avgRating?.toFixed(1)} ({selected?.totalRatings} reviews)</Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Your Name</FormLabel>
                <Input placeholder="Full name" value={booking.customerName}
                  onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                  focusBorderColor="yellow.400" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Phone Number</FormLabel>
                <Input placeholder="10-digit mobile number" value={booking.customerPhone}
                  onChange={(e) => setBooking({ ...booking, customerPhone: e.target.value })}
                  focusBorderColor="yellow.400" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Service Address</FormLabel>
                <Textarea placeholder="Full address where service is needed" value={booking.address}
                  onChange={(e) => setBooking({ ...booking, address: e.target.value })}
                  focusBorderColor="yellow.400" rows={2} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Preferred Date & Time</FormLabel>
                <Input type="datetime-local" value={booking.scheduledAt}
                  onChange={(e) => setBooking({ ...booking, scheduledAt: e.target.value })}
                  focusBorderColor="yellow.400"
                  min={new Date().toISOString().slice(0, 16)} />
              </FormControl>

              <Box bg="gray.50" borderRadius="xl" p={4} mt={4} w="100%">
                <Heading size="sm" mb={3}>Payment Information</Heading>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Payment Method</FormLabel>
                  <Select
                    value={paymentInfo.method}
                    onChange={(e) => {
                      setPaymentInfo({ ...paymentInfo, method: e.target.value });
                      setUpiAuthorized(false);
                    }}
                    focusBorderColor="yellow.400"
                  >
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="NETBANKING">NetBanking</option>
                    <option value="COD">Cash on Delivery</option>
                  </Select>
                </FormControl>

                {paymentInfo.method === "CARD" && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={3}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Cardholder Name</FormLabel>
                      <Input value={paymentInfo.cardName} placeholder="Name on card"
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        focusBorderColor="yellow.400" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Card Number</FormLabel>
                      <Input value={paymentInfo.cardNumber} placeholder="1234 5678 9012 3456"
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        focusBorderColor="yellow.400" maxLength={19} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Expiry</FormLabel>
                      <Input value={paymentInfo.expiry} placeholder="MM/YY"
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                        focusBorderColor="yellow.400" maxLength={5} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">CVV</FormLabel>
                      <Input value={paymentInfo.cvv} placeholder="123"
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                        focusBorderColor="yellow.400" maxLength={4} type="password" />
                    </FormControl>
                  </SimpleGrid>
                )}

                {paymentInfo.method === "UPI" && (
                  <Box mt={3} p={4} bg="white" borderRadius="xl" border="1px solid" borderColor="green.100">
                    <Text fontSize="sm" color="gray.600" mb={3}>
                      Use your UPI app to pay <Text as="span" fontWeight="bold">{paymentInfo.upiId || "yourupi@bank"}</Text>
                    </Text>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">UPI ID</FormLabel>
                      <Input value={paymentInfo.upiId} placeholder="example@upi"
                        onChange={(e) => {
                          setPaymentInfo({ ...paymentInfo, upiId: e.target.value });
                          setUpiAuthorized(false);
                        }}
                        focusBorderColor="yellow.400" />
                    </FormControl>
                    <Button
                      mt={4}
                      size="sm"
                      colorScheme="green"
                      w="full"
                      onClick={() => {
                        if (!paymentInfo.upiId?.trim()) {
                          toast({ title: "Enter a valid UPI ID", status: "warning", duration: 2000, position: "top" });
                          return;
                        }
                        setUpiAuthorized(true);
                        toast({ title: "UPI payment authorized", description: "Mock UPI payment completed successfully.", status: "success", duration: 3000, position: "top" });
                      }}
                      isDisabled={upiAuthorized}
                    >
                      {upiAuthorized ? "UPI Authorized" : "Simulate UPI payment"}
                    </Button>
                    {upiAuthorized && (
                      <Text mt={3} fontSize="sm" color="green.600">
                        UPI authorization completed. Click below to finish booking.
                      </Text>
                    )}
                  </Box>
                )}

                {paymentInfo.method === "NETBANKING" && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={3}>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Bank Name</FormLabel>
                      <Input value={paymentInfo.bankName} placeholder="Bank name"
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                        focusBorderColor="yellow.400" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Account Number</FormLabel>
                      <Input value={paymentInfo.accountNumber} placeholder="Account number"
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                        focusBorderColor="yellow.400" />
                    </FormControl>
                    <FormControl gridColumn={{ md: "span 2" }}>
                      <FormLabel fontSize="sm">IFSC Code</FormLabel>
                      <Input value={paymentInfo.ifsc} placeholder="IFSC code"
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, ifsc: e.target.value })}
                        focusBorderColor="yellow.400" />
                    </FormControl>
                  </SimpleGrid>
                )}

                {paymentInfo.method === "COD" && (
                  <Box mt={3} p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="yellow.200">
                    <Text fontSize="sm" color="gray.600">
                      Cash on Delivery selected. Please pay the provider in cash after the service is completed.
                    </Text>
                  </Box>
                )}

                <Text fontSize="xs" color="gray.500" mt={2}>
                  This is a simulated payment flow. Your booking will be created after the selected payment method is authorized.
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3} borderTop="1px solid" borderColor="gray.100">
            <Button variant="ghost" onClick={closeBookingModal}>Cancel</Button>
            <Button bg="blackAlpha.900" color="white" _hover={{ bg: "gray.700" }} onClick={handleBook} isLoading={paymentLoading}>
              {paymentInfo.method === "COD"
                ? "Confirm Booking (COD)"
                : `Pay ₹${Number(selected?.price || 0) + 49} & Book`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Rating Modal ── */}
      <Modal isOpen={rateModal.isOpen} onClose={rateModal.onClose} size="sm" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>⭐ Rate {selected?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="flex-start">
              <Text fontSize="sm" color="gray.500">How was your experience?</Text>
              <StarRating value={ratingStars} onChange={setRatingStars} size={8} />
              <Text fontSize="sm" color="gray.500">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][ratingStars]}
              </Text>
              <Textarea
                placeholder="Write a comment (optional)"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                focusBorderColor="yellow.400"
                rows={3}
              />
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={rateModal.onClose}>Cancel</Button>
            <Button colorScheme="yellow" onClick={handleRate}>Submit Rating</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </Box>
  );
}
