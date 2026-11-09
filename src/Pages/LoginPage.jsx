import React, { useState, useEffect } from "react";
import {
  Alert, AlertIcon, Box, Button, Container, Divider,
  Flex, FormControl, FormLabel, Heading, HStack, Image,
  Input, InputGroup, InputLeftElement, InputRightElement,
  Stack, Tab, TabList, TabPanel, TabPanels, Tabs,
  Text, useToast, VStack,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, PhoneIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as Go } from "react-router-dom";
import { loginWithEmail, registerWithEmail } from "../Redux/AuthReducer/action";

// ── Reusable password input ───────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder = "Password" }) {
  const [show, setShow] = useState(false);
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none"><LockIcon color="gray.400" /></InputLeftElement>
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        focusBorderColor="yellow.400"
      />
      <InputRightElement cursor="pointer" onClick={() => setShow(!show)}>
        {show ? <ViewOffIcon color="gray.400" /> : <ViewIcon color="gray.400" />}
      </InputRightElement>
    </InputGroup>
  );
}

// ── Sign In Tab ───────────────────────────────────────────────────────────────
function SignInTab({ onSuccess, onSwitchToRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const dispatch                = useDispatch();
  const { isLoading, isError, errorMsg } = useSelector((s) => s.AuthReducer);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await dispatch(loginWithEmail(email, password));
    if (ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        {isError && (
          <Alert status="error" borderRadius="md" fontSize="sm">
            <AlertIcon />{errorMsg}
          </Alert>
        )}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Email Address</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><EmailIcon color="gray.400" /></InputLeftElement>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="yellow.400"
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Password</FormLabel>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button
          type="submit"
          w="100%"
          bg="blackAlpha.900"
          color="white"
          _hover={{ bg: "gray.700" }}
          isLoading={isLoading}
          loadingText="Signing in..."
          size="lg"
        >
          Sign In
        </Button>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Don't have an account?{" "}
          <Text as="span" color="yellow.600" fontWeight="bold" cursor="pointer" onClick={onSwitchToRegister}>
            Register here
          </Text>
        </Text>
      </VStack>
    </form>
  );
}

// ── Register Tab ──────────────────────────────────────────────────────────────
function RegisterTab({ onSuccess, onSwitchToSignIn }) {
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "", confirm: "",
  });
  const [localErr, setLocalErr] = useState("");
  const dispatch = useDispatch();
  const { isLoading, isError, errorMsg } = useSelector((s) => s.AuthReducer);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.mobile)) {
      setLocalErr("Enter a valid 10-digit mobile number.");
      return;
    }
    if (form.password !== form.confirm) {
      setLocalErr("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setLocalErr("Password must be at least 6 characters.");
      return;
    }
    setLocalErr("");
    const ok = await dispatch(registerWithEmail(form.name, form.email, form.mobile, form.password));
    if (ok) onSuccess();
  };

  const displayErr = localErr || (isError ? errorMsg : "");

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        {displayErr && (
          <Alert status="error" borderRadius="md" fontSize="sm">
            <AlertIcon />{displayErr}
          </Alert>
        )}

        {/* Full Name */}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Full Name</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Box as={FaUser} color="gray.400" fontSize="14px" />
            </InputLeftElement>
            <Input
              placeholder="John Doe"
              value={form.name}
              onChange={set("name")}
              focusBorderColor="yellow.400"
            />
          </InputGroup>
        </FormControl>

        {/* Email */}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Email Address</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><EmailIcon color="gray.400" /></InputLeftElement>
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              focusBorderColor="yellow.400"
            />
          </InputGroup>
        </FormControl>

        {/* Mobile Number */}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Mobile Number</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none"><PhoneIcon color="gray.400" /></InputLeftElement>
            <Input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={set("mobile")}
              maxLength={10}
              focusBorderColor="yellow.400"
            />
          </InputGroup>
          <Text fontSize="xs" color="gray.400" mt={1}>Enter 10-digit number without country code</Text>
        </FormControl>

        {/* Password */}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Password</FormLabel>
          <PasswordInput value={form.password} onChange={set("password")} />
        </FormControl>

        {/* Confirm Password */}
        <FormControl isRequired>
          <FormLabel fontSize="sm">Confirm Password</FormLabel>
          <PasswordInput
            value={form.confirm}
            onChange={set("confirm")}
            placeholder="Confirm password"
          />
        </FormControl>

        <Button
          type="submit"
          w="100%"
          bg="yellow.400"
          color="black"
          fontWeight="bold"
          _hover={{ bg: "yellow.300" }}
          isLoading={isLoading}
          loadingText="Creating account..."
          size="lg"
        >
          Create Account
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Already have an account?{" "}
          <Text as="span" color="blackAlpha.800" fontWeight="bold" cursor="pointer" onClick={onSwitchToSignIn}>
            Sign in here
          </Text>
        </Text>
      </VStack>
    </form>
  );
}

// ── Main Login Page ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate   = useNavigate();
  const toast      = useToast();
  const { isAuth } = useSelector((s) => s.AuthReducer);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (isAuth) navigate("/user/dashboard", { replace: true });
  }, [isAuth, navigate]);

  const onSuccess = () => {
    toast({
      title: "Welcome! 🎉",
      description: "You are now logged in.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const REVIEWS = [
    { name: "Priya S.",  text: "Booked a plumber in 2 minutes. Amazing!",         stars: 5 },
    { name: "Rahul M.",  text: "Very professional electrician. Highly recommend.", stars: 5 },
    { name: "Sneha K.",  text: "Best home service app I've used.",                 stars: 4 },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Topbar */}
      <Box bg="blackAlpha.900" px={6} py={4}>
        <Go to="/">
          <Image
            src="https://res.cloudinary.com/urbanclap/image/upload/images/growth/home-screen/1631097450980-d2de38.png"
            h="32px"
            cursor="pointer"
          />
        </Go>
      </Box>

      <Container maxW="6xl" py={12}>
        <Flex direction={{ base: "column", lg: "row" }} gap={12} align="flex-start">

          {/* ── Left: Auth Card ── */}
          <Box
            flex={1}
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            p={{ base: 6, md: 10 }}
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack spacing={1} mb={8} textAlign="center">
              <Heading size="lg">
                {tabIndex === 0 ? "Welcome Back 👋" : "Create Account ✨"}
              </Heading>
              <Text color="gray.500" fontSize="sm">
                {tabIndex === 0
                  ? "Sign in to book trusted local services"
                  : "Register with your email and mobile number"}
              </Text>
            </VStack>

            <Tabs isFitted index={tabIndex} onChange={setTabIndex} variant="enclosed">
              <TabList mb={6} borderRadius="lg" overflow="hidden">
                <Tab
                  fontWeight="semibold"
                  _selected={{ bg: "blackAlpha.900", color: "white" }}
                >
                  📧 Sign In
                </Tab>
                <Tab
                  fontWeight="semibold"
                  _selected={{ bg: "yellow.400", color: "black" }}
                >
                  ✨ Register
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <SignInTab
                    onSuccess={onSuccess}
                    onSwitchToRegister={() => setTabIndex(1)}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <RegisterTab
                    onSuccess={onSuccess}
                    onSwitchToSignIn={() => setTabIndex(0)}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Divider my={6} />
            <HStack spacing={3} justify="center" mb={4}>
              <Text fontSize="xs" color="gray.500">Or sign in as:</Text>
              <Button size="xs" colorScheme="yellow" variant="outline" onClick={() => navigate("/provider")}>Provider</Button>
              <Button size="xs" colorScheme="yellow" variant="outline" onClick={() => navigate("/admin")}>Admin</Button>
            </HStack>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              By continuing, you agree to our{" "}
              <Text as="span" color="blue.500" cursor="pointer">Terms of Service</Text>
              {" "}and{" "}
              <Text as="span" color="blue.500" cursor="pointer">Privacy Policy</Text>.
            </Text>
          </Box>

          {/* ── Right: Info Panel ── */}
          <Box flex={1}>
            <VStack align="flex-start" spacing={4} mb={10}>
              <Heading size="xl" lineHeight="shorter">
                Your home deserves<br />
                <Text as="span" color="yellow.500">the best care</Text>
              </Heading>
              <Text color="gray.600">
                Access 2,000+ verified professionals across 30+ cities.
                Plumbers, electricians, cleaners and more — at your doorstep.
              </Text>
            </VStack>

            <VStack align="flex-start" spacing={3} mb={10}>
              {[
                { icon: "✅", text: "Verified & background-checked professionals" },
                { icon: "⚡", text: "Book in under 2 minutes" },
                { icon: "💰", text: "Transparent pricing, no hidden charges" },
                { icon: "🔄", text: "Free re-service if not satisfied" },
                { icon: "📍", text: "Real-time tracking of your professional" },
              ].map((f) => (
                <HStack key={f.text} spacing={3}>
                  <Text fontSize="lg">{f.icon}</Text>
                  <Text fontSize="sm" color="gray.700">{f.text}</Text>
                </HStack>
              ))}
            </VStack>

            <Text fontWeight="bold" mb={4} fontSize="sm" color="gray.500" textTransform="uppercase" letterSpacing="wider">
              What our customers say
            </Text>
            <Stack spacing={4}>
              {REVIEWS.map((r) => (
                <Box key={r.name} bg="white" borderRadius="xl" p={4} boxShadow="sm" border="1px solid" borderColor="gray.100">
                  <Text color="yellow.400">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</Text>
                  <Text fontSize="sm" color="gray.700" mt={1}>"{r.text}"</Text>
                  <Text fontSize="xs" color="gray.400" mt={2} fontWeight="bold">— {r.name}</Text>
                </Box>
              ))}
            </Stack>
          </Box>

        </Flex>
      </Container>
    </Box>
  );
}
