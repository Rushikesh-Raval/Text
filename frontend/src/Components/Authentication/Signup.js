import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setname] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  // const postDetails = (pics) => {
  //   // console.log(pics);
  //   setLoading(true);
  //   if (pics === undefined) {
  //     toast({
  //       title: "Please select an image",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     return;
  //   }
  //   if (
  //     pics.type === "image/jpeg" ||
  //     pics.type === "image/png" ||
  //     pics.type === "image/jpg"
  //   ) {
  //     const data = new FormData();
  //     data.append("file", pics);
  //     data.append("upload_preset", "chat-app");
  //     data.append("cloud_name", "dnb3bpgxr");
  //     fetch("https://api.cloudinary.com/v1_1/dnb3bpgxr/image/upload", {
  //       method: "post",
  //       body: data,
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setPic(data.url.toString());
  //         setLoading(false);
  //       })

  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //         // toast({
  //         //   title: "Error uploading image",
  //         //   status: "error",
  //         //   duration: 5000,
  //         //   isClosable: true,
  //         //   position: "bottom",
  //         // })
  //       })
  //       // .then((data) => console.log(data)) //temp
  //       // .catch((err) => {
  //       //   console.log(err);
  //       //   setLoading(false);
  //       // });
  //   } else {
  //     toast({
  //       title: "Please select an image",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     return;
  //   }
  // };

  const postDetails = (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // Validate image type
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app"); // Ensure this preset exists in Cloudinary
      data.append("cloud_name", "dnb3bpgxr"); // Ensure cloud name is correct

      // Log data to make sure it's being formed correctly
      console.log("Uploading file to Cloudinary:", pics);

      fetch("https://api.cloudinary.com/v1_1/dnb3bpgxr/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => {
          // Check for non-200 status codes
          if (!res.ok) {
            throw new Error(
              `Cloudinary error: ${res.statusText} (${res.status})`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log("Cloudinary Response:", data); // Debugging the full response
          if (data.secure_url) {
            setPic(data.secure_url); // Set picture if upload is successful
            toast({
              title: "Image uploaded successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } else {
            throw new Error(
              "Failed to get secure URL from Cloudinary response"
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error uploading to Cloudinary:", err); // Log error details
          setLoading(false);
          toast({
            title: "Error uploading image",
            description: err.message || "An error occurred during upload",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    } else {
      toast({
        title: "Please select a valid image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  // const submitHandler = async () => {
  //   setLoading(true);
  //   if (!name || !email || !password || !confirmpassword) {
  //     toast({
  //       title: "Please Fill All The Fields",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     setLoading(false);
  //     return;
  //   }
  //   if (password !== confirmpassword) {
  //     toast({
  //       title: "Pasword Do Not Match Confirm Password",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const config = {
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     };
  //     const { data } = await axios.post(
  //       "http://localhost:5001/api/user",
  //       { name, email, password, pic },
  //       config
  //     );

  //     toast({
  //       title: "Congratulations!!! You Have Signed Up Sucessfully",
  //       status: "success",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     localStorage.setItem("userInfo", JSON.stringify(data));
  //     setLoading(false);
  //     navigate("/chats");
  //   } catch (error) {
  //     toast({
  //       title: "Error Occured!",
  //       description: error.response.data.message,
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //     setLoading(false);
  //   }
  // };



  const submitHandler = async () => {
    try {
      setLoading(true);
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://172.20.10.3:5001/api/user",
        { name, email, password, pic },
        config
      );
  
      if (!data) {
        throw new Error("No data received from API");
      }
  
      toast({
        title: "Successfully signed up!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log("API call failed", error.response); // Log the full error response
      toast({
        title: "Error occurred!",
        description: error.response ? error.response.data.message : error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>name</FormLabel>
        <Input
          placeholder="Enter Your name"
          onChange={(e) => setname(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password Again To Confirm"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*" //This will just accept a image nothing other than that
          onChange={(e) => postDetails(e.target.files[0])} //This will avoid selecting multiple images
        ></Input>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
