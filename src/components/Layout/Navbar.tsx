import logo from '@/assets/logo.svg';
import { Text, Flex, HStack, Image, VStack, useToast, UseToastOptions, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const toast = useToast();
  const location = useLocation();

  const showToast = useCallback((event: unknown, status: UseToastOptions['status'], content: string) => {
    toast({
      description: content,
      status,
    });
  }, [toast]);

  useEffect(() => {
    ipcRenderer.on('showToast', showToast);

    return () => {
      ipcRenderer.removeListener('showToast', showToast);
    };
  }, [showToast]);

  return (
    <Flex
      py={4}
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth="1px"
      borderColor="gray.200"
      className="draggable"
    >
      <HStack spacing={3} alignItems="center" px={6}>
        <Image src={logo} alt="logo" h={10} w={10} />
        <VStack spacing={0} alignItems="flex-start">
          <Text fontSize="md" fontWeight="bold">
            Metadata Viewer
          </Text>
          <Text fontSize="sm" color="gray.600">
            via ExifTool
          </Text>
        </VStack>
      </HStack>
      <Breadcrumb pr={6} separator={'|'}>
        <BreadcrumbItem
          isCurrentPage={location.pathname === '/'}
          fontWeight={location.pathname === '/' ? 600 : 400}
        >
          <BreadcrumbLink as={Link} to='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem
          isCurrentPage={location.pathname === '/changes'}
          fontWeight={location.pathname === '/changes' ? 600 : 400}
        >
          <BreadcrumbLink as={Link} to='/changes'>Changes</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Flex>
  );
}
