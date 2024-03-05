import logo from '@/assets/logo.svg';
import { Text, Flex, HStack, Image, VStack, useToast, UseToastOptions, Button } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { AiFillFolder } from 'react-icons/ai';

export default function Navbar() {
  const toast = useToast();

  const showToast = (event: any, status: UseToastOptions['status'], content: string) => {
    toast({
      description: content,
      status: status,
    });
  };

  useEffect(() => {
    ipcRenderer.on('showToast', showToast);

    return () => {
      ipcRenderer.removeListener('showToast', showToast);
    };
  }, []);

  const scanFolder = () => {
    ipcRenderer.invoke('scan-folder');
  }

  return (
    <Flex
      py={4}
      alignItems={'center'}
      justifyContent={'space-between'}
      borderBottom="1px"
      borderColor="gray.200"
      className="draggable"
    >
      <HStack spacing={3} alignItems={'center'} px={6}>
        <Image src={logo} alt="logo" h={10} w={10} />
        <VStack spacing={0} alignItems={'flex-start'}>
          <Text fontSize="md" fontWeight={'bold'}>
            Metadata Viewer
          </Text>
          <Text fontSize="sm" color="gray.600">
            via ExifTool
          </Text>
        </VStack>
      </HStack>
      <Button colorScheme="blue" mr={4} leftIcon={<AiFillFolder />} onClick={scanFolder}>
        Scan Folder
      </Button>
    </Flex>
  );
}
