import React, { useState } from "react";
import {
  Box, Button, FormControl, FormLabel, Heading, Input,
  Text, VStack, useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const toast    = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const admin = await response.json();
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_info", JSON.stringify(admin));
        navigate("/admin/dashboard");
      } else {
        let message = "Invalid admin credentials";
        try {
          const payload = await response.json();
          message = payload.error || payload.message || message;
        } catch {
          const text = await response.text();
          if (text) message = text;
        }
        toast({ title: message, status: "error", duration: 4000, isClosable: true });
      }
    } catch (error) {
      toast({ title: "Login failed", status: "error", duration: 3000, isClosable: true });
    }
    setLoading(false);
  };

  return (
    <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" borderRadius="2xl" p={10} w={{ base: "90%", md: "400px" }} boxShadow="2xl">
        <VStack spacing={6} as="form" onSubmit={handleLogin}>
          <Heading size="lg">🛡️ Admin Login</Heading>
          <Text fontSize="sm" color="gray.500">Urban Company — Admin Panel</Text>

          <FormControl isRequired>
            <FormLabel fontSize="sm">Email</FormLabel>
            <Input type="email" placeholder="sanjay456@urbancompany.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="yellow.400" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm">Password</FormLabel>
            <Input type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="yellow.400" />
          </FormControl>

          <Button type="submit" w="100%" bg="blackAlpha.900" color="white"
            _hover={{ bg: "gray.700" }} isLoading={loading}>
            Sign In as Admin
          </Button>

          <Box bg="yellow.50" borderRadius="xl" p={4} w="100%" textAlign="left">
            <Text fontSize="xs" fontWeight="bold" color="gray.800" mb={2}>Admin credentials</Text>
            <Text fontSize="sm" color="gray.700">Username: <Text as="span" fontWeight="semibold">admin@urbancompany.com</Text></Text>
            <Text fontSize="sm" color="gray.700">Password: <Text as="span" fontWeight="semibold">Admin@123</Text></Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
