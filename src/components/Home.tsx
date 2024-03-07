import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VStack, Divider, Flex, Text, Button, HStack, Icon, CircularProgress, Input, Center } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { AiOutlineFile, AiOutlineFolder, AiOutlineFolderOpen } from 'react-icons/ai';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { selectSource, setSource } from '@/redux/mainReducer';
import Layout from './Layout/Layout';

import { FolderDetails, MetaDetail } from './types';

export function Component() {
  const dispatch = useDispatch();

  const srcData = useSelector(selectSource);

  // const [folder, setFolder] = useState<string>("");
  // const [files, setFiles] = useState<string[]>([]);
  const [curPath, setCurPath] = useState<string>("");
  const [curMeta, setCurMeta] = useState<MetaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [changed, setChanged] = useState<number[]>([]);

  useEffect(() => {
    ipcRenderer.on('read-folder', (event: unknown, data: FolderDetails) => {
      // setFolder(data.folder);
      // setFiles(data.files);

      dispatch(setSource({
        dir: data.folder,
        files: data.files
      }));
    });

    ipcRenderer.on('read-file', (event: unknown, data: MetaDetail[]) => {
      if (loading) return;

      setCurMeta(data);
      setLoading(false);
    });
  }, []);

  const scanFolder = () => {
    ipcRenderer.invoke('scan-folder');
  }

  const openFile = (file:string) => () => {
    setLoading(true);
    setCurPath(file);
    ipcRenderer.invoke('scan-file', {
      path: srcData.dir + '\\' + file
    });
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }

  return (
    <Layout>
      <Flex w="full">
        <VStack align={'left'}>
          <HStack style={{ width: 'calc(100vw - 2rem)' }}>
            <Icon as={AiOutlineFolder} boxSize={8} color={'blue.600'} />
            <Text flex={1}>{srcData.dir}</Text>
            <Button colorScheme="blue" mr={4} leftIcon={<AiOutlineFolderOpen />} onClick={scanFolder}>
              Open Folder
            </Button>
          </HStack>
          <Divider />
          <HStack h="full">
            <VStack align={'left'} w="xs">
              {
                srcData.files.length == 0
                  ? <Center>
                      <VStack>
                        <Icon as={AiOutlineFolderOpen} boxSize={20} color={'blue.600'}></Icon>
                        <Text fontWeight={'bold'}>Media files will be displayed here.</Text>
                      </VStack>
                    </Center>
                  : <PerfectScrollbar>
                      <div style={{ position: 'relative', height: 'calc(100vh - 200px)' }}>
                        {srcData.files.map((file: string, index: number) => (
                          <HStack 
                            key={'fs' + index}
                            overflow={'hidden'} 
                            textOverflow={'ellipsis'} 
                            whiteSpace={'nowrap'} 
                            cursor={'pointer'} 
                            userSelect={'none'} 
                            _hover={{color: 'gray.400'}}
                            onClick={openFile(file)}
                            > 
                            <Icon as={AiOutlineFile} boxSize={8} color={'teal.600'} />
                            <Text textDecoration={curPath == file ? 'underline' : ''}>{file}</Text>
                          </HStack>
                        ))}
                      </div>
                    </PerfectScrollbar>
              }
            </VStack>
            <Divider orientation='vertical' />
            <VStack flex={1}>
              <Input type='search' placeholder='Search' onChange={handleSearch} value={searchText} />
              <Divider />
              {
                loading 
                  ? <Center height={'calc(100vh - 240px)'}>
                      <CircularProgress isIndeterminate />
                    </Center>
                  : <PerfectScrollbar style={{ width: '100%' }}>
                      <div style={{ position: 'relative', height: 'calc(100vh - 240px)' }}>
                        {curMeta.filter(meta => meta.type.toUpperCase().includes(searchText.toUpperCase())).map((meta) => (
                          <HStack mb={1} key={'fd' + meta.index}>
                            <Text w="xs">{meta.type}</Text>
                            <Input 
                              value={meta.value} 
                              disabled={true} 
                              onChange={(e) => {
                                const copyOfMeta = [...curMeta];
                                copyOfMeta[meta.index].value = e.target.value;
                                setCurMeta(copyOfMeta);
                                !changed.includes(meta.index) && setChanged([...changed, meta.index]);
                              }}
                            ></Input>
                          </HStack>
                        ))}
                      </div>
                    </PerfectScrollbar>
              }
            </VStack>
          </HStack>
        </VStack>
      </Flex>
    </Layout>
  );
}
