import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  DrawerOverlay,
  Button,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { IoMenu } from "react-icons/io5";
import { IoIosMoon } from "react-icons/io";
import PropTypes from "prop-types";

const NavbarButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Button ref={btnRef} colorScheme="facebook" onClick={onOpen}>
        <IoMenu />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Weather App</DrawerHeader>

          <DrawerBody>
            <Button colorScheme="facebook" onClick={toggleColorMode}>
              {colorMode === "light" ? <IoIosMoon /> : <IoIosMoon />}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

NavbarButton.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
};
export default NavbarButton;
