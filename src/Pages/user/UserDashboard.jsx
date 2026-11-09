import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Avatar, Box, Button, Container, Divider, Flex,
  Heading, HStack, SimpleGrid, Stack, Tag, Text,
  VStack, Badge,
} from "@chakra-ui/react";
import Navbar from "../../Components/Navbar";

const API = "/api";
const STATUS_COLOR = {
  PENDING: "orange",
  CONFIRMED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, isAuth } = useSelector((s) => s.AuthReducer);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login", { replace: true });
      return;
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (!user?.phone) return;
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API}/bookings?phone=${encodeURIComponent(user.phone)}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
          localStorage.setItem("sf_bookings", JSON.stringify(data));
          return;
        }
      } catch (error) {
        // ignore and fallback to local storage
      }
      const stored = JSON.parse(localStorage.getItem("sf_bookings") || "[]");
      setBookings(stored.filter((b) => b.customerPhone === user.phone));
    };
    fetchBookings();
  }, [user?.phone]);

  const active = bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status));
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: "📋", color: "blue" },
    { label: "Active", value: active.length, icon: "⏳", color: "orange" },
    { label: "Completed", value: completed.length, icon: "✅", color: "green" },
    { label: "Cancelled", value: cancelled.length, icon: "red", color: "red" },
  ];

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Box bg="blackAlpha.900" color="white" py={10} px={4}>
        <Container maxW="6xl">
          <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={6}>
            <HStack spacing={4} alignItems="center">
              <Avatar size="xl" name={user?.name || user?.email || "User"} bg="yellow.400" color="black" />
              <Box>
                <Heading size="lg">Welcome, {user?.name || "User"}</Heading>
                <Text color="gray.300" fontSize="sm">
                  Your dashboard for booking management and quick actions.
                </Text>
              </Box>
            </HStack>
            <Stack direction={{ base: "column", md: "row" }} spacing={3} w={{ base: "full", md: "auto" }}>
              <Button colorScheme="yellow" bg="yellow.400" color="black" onClick={() => navigate("/find-services")}>Find Services</Button>
              <Button variant="outline" colorScheme="whiteAlpha" onClick={() => navigate("/my-bookings")}>My Bookings</Button>
            </Stack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={8}>
          {stats.map((s) => (
            <Box key={s.label} bg="white" borderRadius="2xl" p={5} boxShadow="sm" textAlign="center">
              <Text fontSize="2xl">{s.icon}</Text>
              <Text fontSize="3xl" fontWeight="extrabold" color={`${s.color}.500`}>{s.value}</Text>
              <Text fontSize="sm" color="gray.500">{s.label}</Text>
            </Box>
          ))}
        </SimpleGrid>

        <Box bg="white" borderRadius="2xl" boxShadow="sm" p={6} mb={8}>
          <Heading size="md" mb={4}>Profile Summary</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontSize="sm" color="gray.500">Full Name</Text>
              <Text fontWeight="semibold">{user?.name || "-"}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Email</Text>
              <Text fontWeight="semibold">{user?.email || "-"}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Phone</Text>
              <Text fontWeight="semibold">{user?.phone || "-"}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Member Since</Text>
              <Text fontWeight="semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box bg="white" borderRadius="2xl" boxShadow="sm" p={6}>
          <Heading size="md" mb={4}>Recent Bookings</Heading>
          {bookings.length === 0 ? (
            <Box py={14} textAlign="center">
              <Text fontSize="lg" color="gray.600">No bookings yet.</Text>
              <Button mt={5} colorScheme="yellow" onClick={() => navigate("/find-services")}>Book a Service</Button>
            </Box>
          ) : (
            <Stack spacing={4}>
              {bookings.slice(0, 5).map((booking) => (
                <Box key={booking.id} p={4} borderRadius="xl" border="1px solid" borderColor="gray.100">
                  <Flex justify="space-between" align="center" mb={3}>
                    <Box>
                      <Text fontWeight="bold">{booking.provider?.name || "Service Provider"}</Text>
                      <Text fontSize="sm" color="gray.500">{booking.provider?.category || "Service"}</Text>
                    </Box>
                    <Badge colorScheme={STATUS_COLOR[booking.status]}>{booking.status}</Badge>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} fontSize="sm" color="gray.600">
                    <Text>📍 {booking.address}</Text>
                    <Text>📅 {new Date(booking.scheduledAt).toLocaleString()}</Text>
                    <Text>💰 ₹{booking.provider?.price || booking.price || "-"}</Text>
                  </SimpleGrid>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
