import React, { useState } from "react";
import { HStack, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

export function StarRating({ value, onChange, size = 6, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <HStack spacing={1}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          boxSize={size}
          cursor={readonly ? "default" : "pointer"}
          color={star <= (hover || value) ? "yellow.400" : "gray.300"}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange && onChange(star)}
          transition="color 0.1s"
        />
      ))}
      {readonly && (
        <Text fontSize="sm" fontWeight="bold" color="gray.600" ml={1}>
          {value?.toFixed(1)}
        </Text>
      )}
    </HStack>
  );
}
