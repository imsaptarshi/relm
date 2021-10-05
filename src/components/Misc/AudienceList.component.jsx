import { Table, Box, Thead, Tr, Th, Tbody, Td, Text } from "@chakra-ui/react";

function AudienceList({ audience, communityId }) {
  return (
    <Box border="1px" rounded="xl" mt="4" borderColor="whiteAlpha.400">
      <Table variant="simple" colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th color="whiteAlpha.600">Name</Th>
            <Th
              color="whiteAlpha.600"
              display={{ base: "none", md: "table-cell" }}
            >
              Email
            </Th>
            <Th color="whiteAlpha.600">Events</Th>
          </Tr>
        </Thead>
        <Tbody>
          {audience?.length > 0 ? (
            audience?.map((data, key) => (
              <Tr key={key}>
                <Td maxW={{ base: "100px", md: "200px" }}>{data.name}</Td>
                <Td display={{ base: "none", md: "table-cell" }} maxW="200px">
                  {data.email}
                </Td>
                <Td>{data.events.length}</Td>
              </Tr>
            ))
          ) : (
            <Text py="2" px="6" color="whiteAlpha.600">
              No guests
            </Text>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AudienceList;
