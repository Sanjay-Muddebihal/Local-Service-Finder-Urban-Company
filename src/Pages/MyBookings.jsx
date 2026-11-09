import React, { useState, useEffect } from "react";
import {
  Avatar, Badge, Box, Button, Container, Divider, Flex,
  Heading, HStack, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels,
  Tabs, Tag, Text, useDisclosure, useToast, VStack,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  FormControl, FormLabel, Input, Textarea, Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/AppFooter";
import { StarIcon } from "@chakra-ui/icons";
import { StarRating } from "../Components/StarRating";

const API = "/api";

const STATUS_COLOR = {
  PENDING:   "orange",
  CONFIRMED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

const STATUS_ICON = {
  PENDING:   "⏳",
  CONFIRMED: "✅",
  COMPLETED: "🎉",
  CANCELLED: "❌",
};

const CAT_ICONS = {
  Plumbing: "🔧", Electrical: "⚡", Cleaning: "🧹", Carpentry: "🪚",
  Painting: "🎨", "AC Repair": "❄️", "Pest Control": "🐛", Appliance: "🔌",
};

function BookingCard({ booking, onCancel, onRate, onRebook }) {
  const isActive    = ["PENDING", "CONFIRMED"].includes(booking.status);
  const isCompleted = booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";

  return (
    <Box
      bg="white"
      borderRadius="xl"
      boxShadow="md"
      p={5}
      border="1px solid"
      borderColor="gray.100"
      opacity={isCancelled ? 0.7 : 1}
      transition="all 0.2s"
      _hover={{ boxShadow: "lg" }}
    >
      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb={3}>
        <HStack spacing={3}>
          <Avatar
            size="md"
            name={booking.provider?.name}
            bg="blackAlpha.800"
            color="yellow.400"
          />
          <Box>
            <Text fontWeight="bold">{booking.provider?.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {CAT_ICONS[booking.provider?.category]} {booking.provider?.category}
            </Text>
          </Box>
        </HStack>
        <Badge colorScheme={STATUS_COLOR[booking.status]} borderRadius="full" px={3} py={1} fontSize="xs">
          {STATUS_ICON[booking.status]} {booking.status}
        </Badge>
      </Flex>

      <Divider mb={3} />

      {/* Provider Contact Details */}
      <Box w="100%" bg="blue.50" borderRadius="lg" p={3} mb={3} border="1px solid" borderColor="blue.100">
        <Text fontSize="xs" fontWeight="bold" color="blue.600" textTransform="uppercase" letterSpacing="wider" mb={2}>
          👷 Service Provider Contact
        </Text>
        <VStack align="flex-start" spacing={1} fontSize="sm">
          <HStack>
            <Text>🧑‍🔧</Text>
            <Text fontWeight="semibold" color="gray.800">{booking.provider?.name}</Text>
          </HStack>
          <HStack>
            <Text>📞</Text>
            <Text
              as="a"
              href={`tel:${booking.provider?.phone}`}
              color="blue.600"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
            >
              {booking.provider?.phone}
            </Text>
          </HStack>
          <HStack>
            <Text>🏙️</Text>
            <Text color="gray.600">{booking.provider?.city}</Text>
          </HStack>
          <HStack>
            <Text>⏱</Text>
            <Text color="gray.600">{booking.provider?.experience} experience</Text>
          </HStack>
        </VStack>
      </Box>

      {/* Booking Details */}
      <VStack align="flex-start" spacing={1} mb={4} fontSize="sm" color="gray.600">
        <HStack><Text>📍</Text><Text>{booking.address}</Text></HStack>
        <HStack>
          <Text>📅</Text>
          <Text>{new Date(booking.scheduledAt).toLocaleString("en-IN", {
            dateStyle: "medium", timeStyle: "short",
          })}</Text>
        </HStack>
        <HStack><Text>📱</Text><Text>Your number: {booking.customerPhone}</Text></HStack>
        <HStack>
          <Text>💰</Text>
          <Text fontWeight="semibold" color="green.600">₹{booking.provider?.price || 299}</Text>
        </HStack>
        {booking.rated && (
          <HStack>
            <Text>⭐</Text>
            <Text color="yellow.500" fontWeight="bold">You rated {booking.ratedStars}★</Text>
          </HStack>
        )}
      </VStack>

      {/* Actions */}
      <HStack spacing={2} flexWrap="wrap">
        {isActive && (
          <Button size="sm" colorScheme="red" variant="outline" onClick={() => onCancel(booking)}>
            Cancel
          </Button>
        )}
        {isCompleted && !booking.rated && (
          <Button size="sm" colorScheme="yellow" onClick={() => onRate(booking)}>
            ⭐ Rate Service
          </Button>
        )}
        {(isCompleted || isCancelled) && (
          <Button size="sm" bg="blackAlpha.900" color="white" _hover={{ bg: "gray.700" }} onClick={() => onRebook(booking)}>
            🔄 Rebook
          </Button>
        )}
        {isActive && (
          <Tag colorScheme="blue" size="sm">
            Booking #{booking.id?.toString().slice(-4) || "0001"}
          </Tag>
        )}
      </HStack>
    </Box>
  );
}

export default function MyBookings() {
  const navigate    = useNavigate();
  const toast       = useToast();
  const { user }    = useSelector((s) => s.AuthReducer);
  const cancelRef   = React.useRef();

  const rateModal   = useDisclosure();
  const cancelModal = useDisclosure();

  const [bookings, setBookings]         = useState([]);
  const [selected, setSelected]         = useState(null);
  const [ratingStars, setRatingStars]   = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [tab, setTab]                   = useState(0);

  // Load from localStorage
  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.phone) {
        try {
          const res = await fetch(`${API}/bookings?phone=${encodeURIComponent(user.phone)}`);
          if (res.ok) {
            const data = await res.json();
            setBookings(data);
            localStorage.setItem("sf_bookings", JSON.stringify(data));
            return;
          }
        } catch (error) {
          // fallback to local storage
        }
      }
      const stored = JSON.parse(localStorage.getItem("sf_bookings") || "[]");
      setBookings(stored);
    };
    fetchBookings();
  }, [user?.phone]);

  const save = (updated) => {
    setBookings(updated);
    localStorage.setItem("sf_bookings", JSON.stringify(updated));
  };

  const handleCancel = async () => {
    try {
      const res = await fetch(`${API}/bookings/${selected.id}/status?status=CANCELLED`, {
        method: "PATCH",
      });
      if (res.ok) {
        const updatedBooking = await res.json();
        const updated = bookings.map((b) => b.id === selected.id ? updatedBooking : b);
        save(updated);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      const updated = bookings.map((b) =>
        b.id === selected.id ? { ...b, status: "CANCELLED" } : b
      );
      save(updated);
    }
    cancelModal.onClose();
    toast({ title: "Booking cancelled", status: "info", duration: 2000 });
  };

  const handleRate = async () => {
    try {
      const res = await fetch(`${API}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: ratingStars,
          comment: ratingComment,
          provider: { id: selected.provider?.id },
          booking: { id: selected.id },
        }),
      });
      if (!res.ok) throw new Error("Rating failed");
      const updated = bookings.map((b) =>
        b.id === selected.id ? { ...b, rated: true, ratedStars: ratingStars, ratingComment } : b
      );
      save(updated);
    } catch (error) {
      const updated = bookings.map((b) =>
        b.id === selected.id ? { ...b, rated: true, ratedStars: ratingStars, ratingComment } : b
      );
      save(updated);
    }
    rateModal.onClose();
    setRatingStars(5);
    setRatingComment("");
    toast({ title: "⭐ Rating submitted! Thank you.", status: "success", duration: 2000 });
  };

  const handleRebook = (booking) => {
    navigate(`/find-services?category=${booking.provider?.category}`);
  };

  const active    = bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status));
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  const EmptyState = ({ msg, icon }) => (
    <Box textAlign="center" py={16}>
      <Text fontSize="5xl" mb={4}>{icon}</Text>
      <Heading size="md" mb={2} color="gray.600">{msg}</Heading>
      <Button mt={4} bg="blackAlpha.900" color="white" _hover={{ bg: "gray.700" }}
        onClick={() => navigate("/find-services")}>
        Browse Services
      </Button>
    </Box>
  );

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      {/* Header */}
      <Box bg="blackAlpha.900" color="white" py={10} px={4}>
        <Container maxW="6xl">
          <HStack spacing={4}>
            <Avatar size="lg" name={user?.name} bg="yellow.400" color="black" />
            <Box>
              <Heading size="lg">My Bookings</Heading>
              <Text color="gray.400" fontSize="sm">
                {user?.name || "User"} · {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
              </Text>
            </Box>
          </HStack>
        </Container>
      </Box>

      <Container maxW="6xl" py={8}>
        {/* Stats row */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          {[
            { label: "Total",     value: bookings.length,   color: "blue",   icon: "📋" },
            { label: "Active",    value: active.length,     color: "orange", icon: "⏳" },
            { label: "Completed", value: completed.length,  color: "green",  icon: "✅" },
            { label: "Cancelled", value: cancelled.length,  color: "red",    icon: "❌" },
          ].map((s) => (
            <Box key={s.label} bg="white" borderRadius="xl" p={4} boxShadow="sm" textAlign="center">
              <Text fontSize="2xl">{s.icon}</Text>
              <Text fontSize="2xl" fontWeight="extrabold" color={`${s.color}.500`}>{s.value}</Text>
              <Text fontSize="sm" color="gray.500">{s.label}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Tabs */}
        <Tabs index={tab} onChange={setTab} colorScheme="yellow" variant="enclosed">
          <TabList mb={6} bg="white" borderRadius="xl" p={1} boxShadow="sm">
            <Tab fontWeight="semibold" borderRadius="lg" _selected={{ bg: "blackAlpha.900", color: "white" }}>
              ⏳ Active ({active.length})
            </Tab>
            <Tab fontWeight="semibold" borderRadius="lg" _selected={{ bg: "green.500", color: "white" }}>
              ✅ Completed ({completed.length})
            </Tab>
            <Tab fontWeight="semibold" borderRadius="lg" _selected={{ bg: "red.500", color: "white" }}>
              ❌ Cancelled ({cancelled.length})
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {active.length === 0
                ? <EmptyState icon="📭" msg="No active bookings" />
                : <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                    {active.map((b) => (
                      <BookingCard key={b.id} booking={b}
                        onCancel={(bk) => { setSelected(bk); cancelModal.onOpen(); }}
                        onRate={(bk)   => { setSelected(bk); rateModal.onOpen(); }}
                        onRebook={handleRebook}
                      />
                    ))}
                  </SimpleGrid>
              }
            </TabPanel>
            <TabPanel px={0}>
              {completed.length === 0
                ? <EmptyState icon="🎉" msg="No completed bookings yet" />
                : <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                    {completed.map((b) => (
                      <BookingCard key={b.id} booking={b}
                        onCancel={() => {}}
                        onRate={(bk) => { setSelected(bk); rateModal.onOpen(); }}
                        onRebook={handleRebook}
                      />
                    ))}
                  </SimpleGrid>
              }
            </TabPanel>
            <TabPanel px={0}>
              {cancelled.length === 0
                ? <EmptyState icon="✨" msg="No cancelled bookings" />
                : <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                    {cancelled.map((b) => (
                      <BookingCard key={b.id} booking={b}
                        onCancel={() => {}}
                        onRate={() => {}}
                        onRebook={handleRebook}
                      />
                    ))}
                  </SimpleGrid>
              }
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* ── Rate Modal ── */}
      <Modal isOpen={rateModal.isOpen} onClose={rateModal.onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Rate {selected?.provider?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="flex-start">
              <Text fontSize="sm" color="gray.500">How was your experience?</Text>
              <StarRating value={ratingStars} onChange={setRatingStars} />
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

      {/* ── Cancel Confirm Dialog ── */}
      <AlertDialog isOpen={cancelModal.isOpen} leastDestructiveRef={cancelRef} onClose={cancelModal.onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontWeight="bold">Cancel Booking?</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to cancel the booking with <b>{selected?.provider?.name}</b>?
              This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={cancelModal.onClose}>Keep Booking</Button>
              <Button colorScheme="red" onClick={handleCancel}>Yes, Cancel</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Footer />
    </Box>
  );
}
