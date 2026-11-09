import React, { useState } from "react";
import {
  Box, Button, FormControl, FormLabel, Heading, Input,
  Select, Tab, TabList, TabPanel, TabPanels, Tabs,
  Text, VStack, useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const API = "/api";
const CATEGORIES = ["Plumbing","Electrical","Cleaning","Carpentry","Painting","AC Repair","Pest Control","Appliance"];
const CITIES     = ["Ahmedabad","Bangalore","Chennai","Delhi","Hyderabad","Kolkata","Mumbai","Pune"];

export default function ProviderLogin () {
  const toast    = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState({ phone: "", password: "" });
  const [reg, setReg]     = useState({
    name: "", phone: "", password: "", category: "", city: "", experience: "", price: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/services/login?phone=${encodeURIComponent(login.phone)}&password=${encodeURIComponent(login.password)}`);
      if (!res.ok) throw new Error("Invalid credentials");
      const found = await res.json();
      localStorage.setItem("provider_auth", JSON.stringify({ id: found.id, name: found.name, phone: found.phone }));
      navigate("/provider/dashboard");
    } catch (error) {
      toast({ title: "Invalid credentials", status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!reg.name || !reg.phone || !reg.password || !reg.category || !reg.city) {
      toast({ title: "Fill all required fields", status: "warning", duration: 2000 });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reg.name,
          phone: reg.phone,
          password: reg.password,
          category: reg.category,
          city: reg.city,
          experience: reg.experience || "1 yr",
          price: Number(reg.price) || 199,
          available: true,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Registration failed");
      }
      const newProvider = await res.json();
      localStorage.setItem("provider_auth", JSON.stringify({ id: newProvider.id, name: newProvider.name, phone: newProvider.phone }));
      navigate("/provider/dashboard");
    } catch (error) {
      toast({ title: error.message || "Registration failed", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" borderRadius="2xl" p={8} w={{ base: "90%", md: "440px" }} boxShadow="2xl">
        <Heading size="lg" mb={1} textAlign="center">👷 Provider Portal</Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center" mb={5}>Urban Company — Service Provider</Text>

        <Tabs colorScheme="yellow" isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab fontWeight="semibold" _selected={{ bg: "blackAlpha.900", color: "white" }}>Sign In</Tab>
            <Tab fontWeight="semibold" _selected={{ bg: "blackAlpha.900", color: "white" }}>Register</Tab>
          </TabList>

          <TabPanels>
            {/* Login */}
            <TabPanel px={0}>
              <VStack spacing={4} as="form" onSubmit={handleLogin}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Phone Number</FormLabel>
                  <Input placeholder="10-digit mobile" value={login.phone}
                    onChange={(e) => setLogin({ ...login, phone: e.target.value })}
                    focusBorderColor="yellow.400" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Password</FormLabel>
                  <Input type="password" placeholder="••••••••" value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                    focusBorderColor="yellow.400" />
                </FormControl>
                <Button type="submit" w="100%" bg="blackAlpha.900" color="white"
                  _hover={{ bg: "gray.700" }} isLoading={loading}>
                  Sign In
                </Button>
              </VStack>
            </TabPanel>

            {/* Register */}
            <TabPanel px={0}>
              <VStack spacing={3} as="form" onSubmit={handleRegister}>
                {[
                  { label:"Full Name *",     key:"name",       type:"text",   ph:"Your name"       },
                  { label:"Phone *",         key:"phone",      type:"tel",    ph:"10-digit number"  },
                  { label:"Password *",      key:"password",   type:"password",ph:"Create password" },
                  { label:"Experience",      key:"experience", type:"text",   ph:"e.g. 5 yrs"       },
                  { label:"Price (₹/visit)", key:"price",      type:"number", ph:"e.g. 299"         },
                ].map(({ label, key, type, ph }) => (
                  <FormControl key={key} isRequired={label.includes("*")}>
                    <FormLabel fontSize="sm">{label}</FormLabel>
                    <Input type={type} placeholder={ph} value={reg[key]}
                      onChange={(e) => setReg({ ...reg, [key]: e.target.value })}
                      focusBorderColor="yellow.400" />
                  </FormControl>
                ))}
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Category *</FormLabel>
                  <Select placeholder="Select your service" value={reg.category}
                    onChange={(e) => setReg({ ...reg, category: e.target.value })}
                    focusBorderColor="yellow.400">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">City *</FormLabel>
                  <Select placeholder="Select your city" value={reg.city}
                    onChange={(e) => setReg({ ...reg, city: e.target.value })}
                    focusBorderColor="yellow.400">
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </FormControl>
                <Button type="submit" w="100%" bg="blackAlpha.900" color="white"
                  _hover={{ bg: "gray.700" }} isLoading={loading}>
                  Register as Provider
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
