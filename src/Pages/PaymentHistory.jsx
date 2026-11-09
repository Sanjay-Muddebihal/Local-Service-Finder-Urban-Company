import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/AppFooter";

const API = "/api";

export default function PaymentHistory() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.AuthReducer);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");

      const phone = user?.phone || user?.mobile || user?.email || "";
      if (!phone) {
        setError("No user phone number available to fetch payment history.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/bookings?phone=${encodeURIComponent(phone)}`);
        if (!res.ok) {
          throw new Error("Unable to fetch payment history.");
        }
        const data = await res.json();
        const receipts = data
          .filter((booking) => booking.paymentTransactionId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPayments(receipts);
      } catch (err) {
        const local = JSON.parse(localStorage.getItem("sf_bookings") || "[]");
        const receipts = local.filter((booking) => booking.paymentTransactionId);
        if (receipts.length === 0) {
          setError(err.message || "No payment receipts found.");
        }
        setPayments(receipts);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const totalSpent = payments.reduce((sum, booking) => sum + (Number(booking.amount) || 0), 0);

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />
      <Container maxW="6xl" py={10}>
        <Flex justify="space-between" align="center" mb={6} gap={4}>
          <Box>
            <Heading size="xl">Payment History</Heading>
            <Text color="gray.500" mt={2}>
              View your latest service receipts and transaction details.
            </Text>
          </Box>
          <Button colorScheme="yellow" variant="outline" onClick={() => navigate("/find-services")}>
            Book a new service
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
          <Box bg="white" borderRadius="xl" p={5} boxShadow="sm">
            <Text fontSize="sm" color="gray.500">Receipts</Text>
            <Text fontSize="3xl" fontWeight="extrabold">{payments.length}</Text>
          </Box>
          <Box bg="white" borderRadius="xl" p={5} boxShadow="sm">
            <Text fontSize="sm" color="gray.500">Total Spent</Text>
            <Text fontSize="3xl" fontWeight="extrabold">₹{totalSpent.toFixed(2)}</Text>
          </Box>
          <Box bg="white" borderRadius="xl" p={5} boxShadow="sm">
            <Text fontSize="sm" color="gray.500">Last payment</Text>
            <Text fontSize="3xl" fontWeight="extrabold">
              {payments[0]?.paymentTransactionId ? payments[0].paymentTransactionId.slice(0, 8) : "—"}
            </Text>
          </Box>
        </SimpleGrid>

        {loading ? (
          <Flex justify="center" py={20}>
            <Spinner size="xl" color="yellow.400" />
          </Flex>
        ) : error ? (
          <Box bg="white" borderRadius="xl" p={8} boxShadow="sm" textAlign="center">
            <Heading size="md" mb={3}>No payment receipts found</Heading>
            <Text color="gray.500" mb={4}>{error}</Text>
            <Button colorScheme="yellow" onClick={() => navigate("/find-services")}>Browse services</Button>
          </Box>
        ) : (
          <Box bg="white" borderRadius="xl" p={6} boxShadow="sm">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Receipt ID</Th>
                  <Th>Provider</Th>
                  <Th>Date</Th>
                  <Th>Amount</Th>
                  <Th>Method</Th>
                  <Th>Status</Th>
                  <Th>Transaction</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments.map((booking) => (
                  <Tr key={booking.id}>
                    <Td>{`RCPT-${booking.id?.toString().padStart(6, "0")}`}</Td>
                    <Td>{booking.provider?.name || "Unknown"}</Td>
                    <Td>{new Date(booking.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}</Td>
                    <Td>₹{Number(booking.amount || 0).toFixed(2)}</Td>
                    <Td>{booking.paymentMethod || "—"}</Td>
                    <Td>{booking.status}</Td>
                    <Td>{booking.paymentTransactionId}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  );
}
