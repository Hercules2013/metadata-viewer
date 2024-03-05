import { Flex, Box } from '@chakra-ui/react';
import Navbar from './Navbar';

export default function Layout({
  children,
  includeNavbar = true,
}: {
  children: JSX.Element | JSX.Element[] | null;
  includeNavbar?: boolean;
}) {
  return (
    <Flex direction="column" height={'100vh'} w="full" bg="white">
      {includeNavbar && <Navbar />}
      <Flex flex={1} p={6} w="full">
        {children}
      </Flex>
    </Flex>
  );
}
