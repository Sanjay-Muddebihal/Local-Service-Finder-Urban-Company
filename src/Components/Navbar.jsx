import React from "react";
import {
  Box, Flex, HStack, Image, Button, Stack, Text,
  IconButton, useDisclosure, Avatar, Menu, MenuButton,
  MenuList, MenuItem, MenuDivider, Badge,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Link as Go, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/AuthReducer/action";

const NAV_LINKS = [
  { title: "Find Services",  link: "/find-services" },
  { title: "My Bookings",    link: "/my-bookings"   },
  { title: "Payments",       link: "/payment-history" },
  { title: "Blog",           link: "/blog"           },
];

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { isAuth, user } = useSelector((s) => s.AuthReducer);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box bg="blackAlpha.900" color="whiteAlpha.900" px={4} w="100%" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="6xl" mx="auto">

        {/* Hamburger (mobile) */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          color="blackAlpha.900"
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        {/* Logo + Nav links */}
        <HStack spacing={8} alignItems="center">
          <Go to="/">
            <Image
              src="https://res.cloudinary.com/urbanclap/image/upload/images/growth/home-screen/1631097450980-d2de38.png"
              w="120px"
            />
          </Go>
          <HStack as="nav" spacing={8} display={{ base: "none", md: "flex" }}>
            {NAV_LINKS.map((l) => (
              <Go to={l.link} key={l.title}>
                <Text fontWeight="medium" _hover={{ color: "yellow.300" }} transition="0.2s">
                  {l.title}
                </Text>
              </Go>
            ))}
          </HStack>
        </HStack>

        {/* Right side: auth */}
        <Box display={{ base: "none", md: "flex" }} alignItems="center" gap={3}>
          {isAuth && user ? (
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                _active={{ bg: "whiteAlpha.300" }}
                rightIcon={<ChevronDownIcon />}
              >
                <HStack spacing={2}>
                  <Avatar
                    size="sm"
                    name={user.name || user.email || "User"}
                    src={user.avatar}
                    bg="yellow.400"
                    color="black"
                  />
                  <Text fontSize="sm" fontWeight="semibold">
                    {user.name || user.email?.split("@")[0] || "User"}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList color="black" shadow="xl" borderRadius="xl" border="1px solid" borderColor="gray.100">
                <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
                  <Text fontWeight="bold" fontSize="sm">{user.name || "User"}</Text>
                  <Text fontSize="xs" color="gray.500">{user.email || user.phone || ""}</Text>
                </Box>
                <MenuItem icon={<Text>🏠</Text>} onClick={() => navigate("/user/dashboard")}> 
                  Dashboard
                </MenuItem>
                <MenuItem icon={<Text>📋</Text>} onClick={() => navigate("/my-bookings")}>
                  My Bookings
                </MenuItem>
                <MenuItem icon={<Text>💳</Text>} onClick={() => navigate("/payment-history")}> 
                  Payment History
                </MenuItem>
                <MenuItem icon={<Text>🔍</Text>} onClick={() => navigate("/find-services")}> 
                  Find Services
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<Text>🛡️</Text>} onClick={() => navigate("/admin")}>
                  Admin Panel
                </MenuItem>
                <MenuItem icon={<Text>👷</Text>} onClick={() => navigate("/provider")}>
                  Provider Portal
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<Text>🚪</Text>} color="red.500" onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={3}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                bg="yellow.400"
                color="black"
                fontWeight="bold"
                _hover={{ bg: "yellow.300" }}
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
            </HStack>
          )}
        </Box>
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            {NAV_LINKS.map((l) => (
              <Go to={l.link} key={l.title} onClick={onClose}>
                <Text fontWeight="medium">{l.title}</Text>
              </Go>
            ))}
            <Text color="gray.300" cursor="pointer" fontWeight="medium"
              onClick={() => { navigate("/admin"); onClose(); }}>
              🛡️ Admin Panel
            </Text>
            <Text color="gray.300" cursor="pointer" fontWeight="medium"
              onClick={() => { navigate("/provider"); onClose(); }}>
              👷 Provider Portal
            </Text>
            {isAuth ? (
              <Text color="red.300" cursor="pointer" fontWeight="medium" onClick={handleLogout}>
                Logout
              </Text>
            ) : (
              <Text color="yellow.300" cursor="pointer" fontWeight="medium"
                onClick={() => { navigate("/login"); onClose(); }}>
                Sign In / Register
              </Text>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
