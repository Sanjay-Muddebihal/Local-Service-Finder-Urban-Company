import React from "react";
import {
  Box, Button, Container, Flex, Grid, GridItem,
  Heading, Image, SimpleGrid, Stack, Text, VStack, Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/AppFooter";

const SERVICES = [
  { name: "Plumbing",      icon: "🔧", color: "blue.50",   desc: "Leaks, pipes, taps & more" },
  { name: "Electrical",    icon: "⚡", color: "yellow.50", desc: "Wiring, switches, fittings" },
  { name: "Cleaning",      icon: "🧹", color: "green.50",  desc: "Home & office deep clean" },
  { name: "Carpentry",     icon: "🪚", color: "orange.50", desc: "Furniture, doors & repairs" },
  { name: "Painting",      icon: "🎨", color: "pink.50",   desc: "Interior & exterior painting" },
  { name: "AC Repair",     icon: "❄️", color: "cyan.50",   desc: "Service, gas refill & repair" },
  { name: "Pest Control",  icon: "🐛", color: "red.50",    desc: "Cockroach, termite & more" },
  { name: "Appliance",     icon: "🔌", color: "purple.50", desc: "Washing machine, fridge fix" },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "2K+",  label: "Expert Professionals" },
  { value: "30+",  label: "Cities Covered" },
  { value: "4.8★", label: "Average Rating" },
];

const HOW = [
  { step: "1", title: "Search Service",   desc: "Pick a category and your city",         icon: "🔍" },
  { step: "2", title: "Choose Provider",  desc: "Compare ratings and book instantly",     icon: "👷" },
  { step: "3", title: "Get It Done",      desc: "Expert arrives at your scheduled time",  icon: "✅" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />

      {/* Hero */}
      <Box
        bgGradient="linear(to-br, blackAlpha.900, gray.800)"
        color="white"
        py={{ base: 16, md: 24 }}
        px={4}
      >
        <Container maxW="6xl">
          <Flex direction={{ base: "column", md: "row" }} align="center" gap={10}>
            <VStack align="flex-start" spacing={6} flex={1}>
              <Badge colorScheme="yellow" fontSize="sm" px={3} py={1} borderRadius="full">
                🏆 #1 Home Services Platform
              </Badge>
              <Heading fontSize={{ base: "3xl", md: "5xl" }} lineHeight="shorter">
                Find Trusted Local<br />
                <Text as="span" color="yellow.400">Service Experts</Text>
              </Heading>
              <Text fontSize="lg" color="gray.300" maxW="md">
                Plumbers, electricians, cleaners & more — verified professionals at your doorstep.
              </Text>
              <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Button
                  size="lg"
                  bg="yellow.400"
                  color="black"
                  fontWeight="bold"
                  _hover={{ bg: "yellow.300" }}
                  onClick={() => navigate("/find-services")}
                >
                  🔍 Find Services
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  color="white"
                  borderColor="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={() => navigate("/my-bookings")}
                >
                  My Bookings
                </Button>
              </Stack>
            </VStack>
            <Box flex={1} display={{ base: "none", md: "block" }}>
              <Image
                src="https://res.cloudinary.com/urbanclap/image/upload/q_auto,f_auto,fl_progressive:steep,w_500/t_high_res_template/images/growth/home-screen/1609757629780-2b2187.png"
                borderRadius="2xl"
                boxShadow="2xl"
                w="100%"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Stats */}
      <Box bg="yellow.400" py={8}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} textAlign="center">
            {STATS.map((s) => (
              <Box key={s.label}>
                <Text fontSize="3xl" fontWeight="extrabold">{s.value}</Text>
                <Text fontSize="sm" fontWeight="medium">{s.label}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Services Grid */}
      <Container maxW="6xl" py={16}>
        <VStack spacing={2} mb={10} textAlign="center">
          <Heading size="xl">Our Services</Heading>
          <Text color="gray.500">Everything your home needs, one tap away</Text>
        </VStack>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={6}>
          {SERVICES.map((s) => (
            <Box
              key={s.name}
              bg={s.color}
              borderRadius="xl"
              p={6}
              textAlign="center"
              cursor="pointer"
              border="2px solid transparent"
              transition="all 0.2s"
              _hover={{ borderColor: "yellow.400", transform: "translateY(-4px)", boxShadow: "lg" }}
              onClick={() => navigate(`/find-services?category=${s.name}`)}
            >
              <Text fontSize="3xl" mb={2}>{s.icon}</Text>
              <Text fontWeight="bold" fontSize="md">{s.name}</Text>
              <Text fontSize="xs" color="gray.500" mt={1}>{s.desc}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* How It Works */}
      <Box bg="gray.50" py={16}>
        <Container maxW="6xl">
          <VStack spacing={2} mb={10} textAlign="center">
            <Heading size="xl">How It Works</Heading>
            <Text color="gray.500">Book a service in 3 simple steps</Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {HOW.map((h) => (
              <VStack
                key={h.step}
                bg="white"
                borderRadius="xl"
                p={8}
                spacing={4}
                boxShadow="md"
                textAlign="center"
              >
                <Box
                  bg="blackAlpha.900"
                  color="yellow.400"
                  w={12} h={12}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="extrabold"
                  fontSize="xl"
                >
                  {h.step}
                </Box>
                <Text fontSize="2xl">{h.icon}</Text>
                <Text fontWeight="bold" fontSize="lg">{h.title}</Text>
                <Text color="gray.500" fontSize="sm">{h.desc}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Banner */}
      <Box bgGradient="linear(to-r, blackAlpha.900, gray.700)" color="white" py={16}>
        <Container maxW="6xl" textAlign="center">
          <Heading size="xl" mb={4}>Ready to book a service?</Heading>
          <Text color="gray.300" mb={8} fontSize="lg">
            Join 50,000+ happy customers who trust us for their home needs.
          </Text>
          <Button
            size="lg"
            bg="yellow.400"
            color="black"
            fontWeight="bold"
            px={10}
            _hover={{ bg: "yellow.300" }}
            onClick={() => navigate("/find-services")}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
