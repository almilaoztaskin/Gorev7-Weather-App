import propTypes from "prop-types";
import {
  Button,
  Select,
  useDisclosure,
  useToast,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import React from "react";
import { LiaSaveSolid } from "react-icons/lia";
import { IconContext } from "react-icons";

const City = (props) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [countries, setcountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCitySelectEnable, setIsCitySelectEnable] = useState(true);
  const [selectedISO, setSelectedISO] = useState("");

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then((response) => response.json())
      .then((data) => setcountries(data.data));
    setSelectedCity("");
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setCities(data.data);
          setIsCitySelectEnable(false);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
          setIsCitySelectEnable(true);
        });
    } else {
      setCities([]);
      setIsCitySelectEnable(true);
    }
    setSelectedCity("");
  }, [selectedCountry]);

  const handleSubmit = () => {
    onClose();
    toast({
      title: "Add Information",
      description: `City added!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    const cityInfo = {
      country: selectedCountry,
      city: selectedCity,
      id: selectedISO,
    };
    //console.log(cityData);
    props.onSaveCity(cityInfo);
    setSelectedCity("");
    setSelectedCountry("");
  };
  return (
    <>
      <Button
        onClick={onOpen}
        size="lg "
        variant="solid "
        leftIcon={<AddIcon />}
        height="30px"
        width="100px"
      >
        Şehir Ekle
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Şehir Ekle</DrawerHeader>

          <DrawerBody>
            <div style={{ marginBottom: "25px" }}>
              <label htmlFor="">Ülke</label>
              <Select
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedISO(
                    e.target.selectedOptions[0].getAttribute("data-key")
                  );
                }}
              >
                <option value="">Ülke Seçiniz...</option>
                {countries.map((country) => (
                  <option
                    key={country.Iso}
                    value={country.name}
                    data-key={country.Iso}
                  >
                    {country.name}
                  </option>
                ))}
              </Select>
            </div>
            <label htmlFor="">Şehir</label>
            <Select
              disabled={isCitySelectEnable}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option
                {...(selectedCity === "" ? { selected: true } : {})}
                value={""}
              >
                Şehir Seçiniz...
              </option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </DrawerBody>
          <DrawerFooter>
            <Button
              leftIcon={<CloseIcon></CloseIcon>}
              variant={"outline"}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              background="teal"
              color="white"
              isDisabled={selectedCountry === "" || selectedCity === ""}
              onClick={handleSubmit}
            >
              <IconContext.Provider value={{ color: "white" }}>
                <LiaSaveSolid />
              </IconContext.Provider>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

City.propTypes = {
  onSaveCity: propTypes.func.isRequired,
};

export default City;
