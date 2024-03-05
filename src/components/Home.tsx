import React, { useEffect, useState } from 'react';
import { Heading, VStack, Divider, Box, Flex, Text, Image, Button, ButtonGroup, HStack, Icon, CircularProgress, Input, Center, InputElementProps, UseToastOptions, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import Layout from './Layout/Layout';
import { ipcRenderer, shell } from 'electron';
import {  AiOutlineEdit, AiOutlineFile, AiOutlineFileSearch, AiOutlineFolder, AiOutlineFolderOpen, AiOutlineSave } from 'react-icons/ai';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { color } from 'framer-motion';

type FolderDetails = {
  folder: string;
  files: string[];
}

type MetaDetail = {
  index: number;
  type: string;
  value: string;
}

export function Component() {
  const toast = useToast();

  const [folder, setFolder] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);
  const [curPath, setCurPath] = useState<string>("");
  const [curMeta, setCurMeta] = useState<MetaDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [changed, setChanged] = useState<number[]>([]);

  useEffect(() => {
    ipcRenderer.on('read-folder', (event, data: FolderDetails) => {
      setFolder(data.folder);
      setFiles(data.files);
    });

    ipcRenderer.on('read-file', (event, data: MetaDetail[]) => {
      if (loading) return;

      setCurMeta(data);
      setLoading(false);
    });
  }, []);

  const openFile = (file:string) => () => {
    setLoading(true);
    setCurPath(file);
    ipcRenderer.invoke('scan-file', {
      path: folder + '\\' + file
    });
  }

  const handleEditOrSave = async () => {
    setEditable(!editable);

    if (!editable) {
      console.log('Saved');

      let command: String = changed.map(index => "-" + curMeta[index].type.replace(/\s+/g, '') + " " + curMeta[index].value + " ").join('');
      command += folder + '\\' + curPath;

      const res: string = await ipcRenderer.invoke('save-file', { command: command });
      if (res == "success") {
        toast({ description: "File has saved successfully.", status: "success" });
      } else {
        toast({ description: "Error while saving file.", status: "error" });
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }

  return (
    <Layout>
      <Flex w="full">
        <VStack align={'left'}>
          <HStack style={{ width: 'calc(100vw - 3rem)' }}>
            <Icon as={AiOutlineFolder} boxSize={8} color={'blue.600'} />
            <Text>{folder}</Text>
          </HStack>
          <Divider />
          <HStack h="full">
            <VStack align={'left'} w="sm">
              {
                files.length == 0
                  ? <Center>
                      <VStack>
                        <Icon as={AiOutlineFolderOpen} boxSize={20} color={'blue.600'}></Icon>
                        <Text fontWeight={'bold'}>File list will be displayed here.</Text>
                      </VStack>
                    </Center>
                  : <PerfectScrollbar>
                      <div style={{ position: 'relative', height: 'calc(100vh - 200px)' }}>
                        {files.map((file, index) => (
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
                            <Text >{file}</Text>
                          </HStack>
                        ))}
                      </div>
                    </PerfectScrollbar>
              }
            </VStack>
            <Divider orientation='vertical' />
            <VStack flex={1}>
              <Input type='search' placeholder='Search the meta information' onChange={handleSearch} value={searchText} />
              <Divider />
              {
                loading 
                  ? <Center height={'calc(100vh - 290px)'}>
                      <CircularProgress isIndeterminate />
                    </Center>
                  : <PerfectScrollbar style={{ width: '100%' }}>
                      <div style={{ position: 'relative', height: 'calc(100vh - 290px)' }}>
                        {curMeta.filter(meta => meta.type.toUpperCase().includes(searchText.toUpperCase())).map((meta) => (
                          <HStack mb={1} key={'fd' + meta.index}>
                            <Text w="xs">{meta.type}</Text>
                            <Input 
                              value={meta.value} 
                              disabled={editable} 
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
              <Divider />
              <Button 
                colorScheme={!editable ? 'blue' : 'teal'} 
                width={'full'} 
                onClick={handleEditOrSave} 
                leftIcon={editable ? <AiOutlineEdit /> : <AiOutlineSave />}
                // disabled={curMeta.length === 0}
                disabled
              >
                { editable ? 'Edit' : 'Save' }
              </Button>
            </VStack>
          </HStack>
        </VStack>
      </Flex>
    </Layout>
  );
}
