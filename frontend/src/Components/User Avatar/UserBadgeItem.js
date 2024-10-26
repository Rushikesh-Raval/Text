import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
    display="flex"
    alignItems="center"
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    backgroundColor="purple"
    color="white"
    cursor="pointer"
    maxW="fit-content"
    onClick={handleFunction}
  >
    <Box>{user.name}</Box>
    <CloseIcon ml={2} />
  </Box>
  
  );
};

export default UserBadgeItem;
