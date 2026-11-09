import React from "react";
import {
  Box, Container, SimpleGrid, Stack, Text, Link,
  chakra, useColorModeValue, VisuallyHidden,
} from "@chakra-ui/react";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const SocialButton = ({ children, label, href }) => (
  <chakra.button
    bg="whiteAlpha.200"
    rounded="full"
    w={8} h={8}
    cursor="pointer"
    as="a"
    href={href}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    _hover={{ bg: "whiteAlpha.400" }}
  >
    <VisuallyHidden>{label}</VisuallyHidden>
    {children}
  </chakra.button>
);

export default function Footer() {
  return (
    <Box bg="blackAlpha.900" color="whiteAlpha.900" mt={10}>
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack>
            <Text fontWeight="bold" fontSize="lg" mb={2}>Company</Text>
            {["About Us", "Careers", "Blog", "Contact Us"].map(t => <Link key={t} href="#">{t}</Link>)}
          </Stack>
          <Stack>
            <Text fontWeight="bold" fontSize="lg" mb={2}>Services</Text>
            {["Plumbing", "Electrical", "Cleaning", "Carpentry"].map(t => <Link key={t} href="#">{t}</Link>)}
          </Stack>
          <Stack>
            <Text fontWeight="bold" fontSize="lg" mb={2}>Support</Text>
            {["Help Center", "Safety", "Community", "Privacy Policy"].map(t => <Link key={t} href="#">{t}</Link>)}
          </Stack>
          <Stack>
            <Text fontWeight="bold" fontSize="lg" mb={2}>Follow Us</Text>
            <Stack direction="row" spacing={4}>
              <SocialButton label="Twitter" href="#"><FaTwitter /></SocialButton>
              <SocialButton label="YouTube" href="#"><FaYoutube /></SocialButton>
              <SocialButton label="Instagram" href="#"><FaInstagram /></SocialButton>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
      <Box borderTopWidth={1} borderColor="whiteAlpha.300">
        <Container maxW="6xl" py={4}>
          <Text textAlign="center" fontSize="sm">© 2024 Local Service Finder. All rights reserved.</Text>
        </Container>
      </Box>
    </Box>
  );
}
