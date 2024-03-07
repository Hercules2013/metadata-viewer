import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { Flex, HStack, Icon, VStack, Text, Button, Divider, Select, Box } from '@chakra-ui/react';
import Layout from './Layout/Layout';
import { AiOutlineFolder, AiOutlineFolderOpen } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { selectSource, selectDest, setSource, setDest, selectKeys } from '@/redux/mainReducer';

import { MetaDetail } from './types';

export function Component() {
  const dispatch = useDispatch();

  const srcData = useSelector(selectSource);
  const destData = useSelector(selectDest);

  const [srcMeta, setSrcMeta] = useState<MetaDetail[]>([]);
  const [srcMetaTypes, setSrcMetaTypes] = useState<string[]>([]);
  const [destMeta, setDestMeta] = useState<MetaDetail[]>([]);
  const [destMetaTypes, setDestMetaTypes] = useState<string[]>([]);

  const [types, setTypes] = useState<string[]>([]);

  const selectSrcFolder = async () => {
    const data = await ipcRenderer.invoke('scan-folder');

    dispatch(setSource({
      dir: data.folder,
      files: data.files,
    }));
  }

  const selectDestFolder = async () => {
    const data = await ipcRenderer.invoke('scan-folder');

    dispatch(setDest({
      dir: data.folder,
      files: data.files,
    }));
  }

  const handleChangeSrc = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value == "") return;

    const srcMeta = await ipcRenderer.invoke('scan-file', {
      path: srcData.dir + '\\' + e.target.value
    });

    setSrcMeta(srcMeta);
    setSrcMetaTypes(srcMeta.map((m: MetaDetail) => m.type));
    checkDifference(srcMeta, destMeta);
  }

  const handleChangeDest = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value == "") return;

    const destMeta = await ipcRenderer.invoke('scan-file', {
      path: destData.dir + '\\' + e.target.value
    });

    setDestMeta(destMeta);
    setDestMetaTypes(destMeta.map((m: MetaDetail) => m.type));
    checkDifference(srcMeta, destMeta);
  }

  const checkDifference = (srcMeta: MetaDetail[], destMeta: MetaDetail[]) => {
    if (srcMeta.length === 0 || destMeta.length === 0) return;

    let allTypes = srcMeta.map(meta => meta.type);
    allTypes = [...allTypes, ...destMeta.filter(meta => allTypes.indexOf(meta.type) == -1).map(meta => meta.type)];

    allTypes.sort();

    setTypes(allTypes);
  }

  // const buildItem = (key: string, type: string, value: string) => {
  //   return (
  //     <HStack mb={1} key={key} w={'full'}>
  //       <Text w={200}>{type}</Text>
  //       <Text flex={1}>{value}</Text>
  //     </HStack>
  //   );
  // }
  const buildItem = (type: string, index: number) => {
    const srcIndex = srcMetaTypes.indexOf(type);
    const destIndex = destMetaTypes.indexOf(type);

    let isDiff = false, isNew = false;
    srcIndex !== -1 && destIndex === -1 && (isDiff = isNew = true);
    srcIndex === -1 && destIndex !== -1 && (isDiff = isNew = true);
    srcIndex !== -1 && destIndex !== -1 && srcMeta[srcIndex].value !== destMeta[destIndex].value && (isDiff = true);

    const leftBg: string = isDiff ? 'red.100' : 'white';
    const rightBg: string = isDiff ? 'green.100' : 'white';

    const leftColor: string = isDiff ? 'red.600' : 'black';
    const rightColor: string = isDiff ? 'green.600' : 'black';

    return (
      <HStack w={'full'} border={0} borderColor={'gray.200'} borderStyle={'solid'} gap={0}>
        <HStack w={'full'}>
          <Text w={10} align={'center'} bg={leftBg}>{index}</Text>
          { srcIndex == -1
            ? ""
            : <>
              <Text w={200}>{srcMeta[srcIndex].type}</Text>
              <Text flex={1} bg={leftBg} color={leftColor}>{srcMeta[srcIndex].value}</Text>
            </>
          }
        </HStack>
        <HStack w={'full'}>
          <Text w={10} align={'center'} bg={rightBg}>{index}</Text>
          { destIndex == -1
            ? ""
            : <>
              <Text w={200}>{destMeta[destIndex].type}</Text>
              <Text flex={1} bg={rightBg} color={rightColor}>{destMeta[destIndex].value}</Text>
            </>
          }
        </HStack>
      </HStack>
    )
  }

  return (
    <Layout>
      <Flex w="full">
        <VStack>
          <HStack>
            <VStack align={'left'}>
              <HStack style={{ width: 'calc(50vw - 2rem)' }}>
                <Icon as={AiOutlineFolder} boxSize={8} color={'blue.600'} />
                <Text isTruncated flex={1} textOverflow={'ellipsis'} title={srcData.dir}>{srcData.dir}</Text>
                <Button colorScheme="blue" mr={4} leftIcon={<AiOutlineFolderOpen />} onClick={selectSrcFolder}>
                  Select Source
                </Button>
              </HStack>
              <Select placeholder='Select source file' onChange={handleChangeSrc}>
                {srcData.files.map((file: string) => <option value={file}>{file}</option>)}
              </Select>
            </VStack>
            <Divider orientation='vertical' />
            <VStack align={'left'}>
              <HStack style={{ width: 'calc(50vw - 2rem)' }}>
                <Icon as={AiOutlineFolder} boxSize={8} color={'blue.600'} />
                <Text isTruncated flex={1} textOverflow={'ellipsis'} title={destData.dir}>{destData.dir}</Text>
                <Button colorScheme="blue" mr={4} leftIcon={<AiOutlineFolderOpen />} onClick={selectDestFolder}>
                  Select Destination
                </Button>
              </HStack>

              <Select placeholder='Select destination file' onChange={handleChangeDest}>
                {destData.files.map((file: string) => <option value={file}>{file}</option>)}
              </Select>
            </VStack>
          </HStack>
          <Box border={1} borderColor={'blue.300'} borderStyle={'solid'} w={'full'} borderRadius={12} p={3}>
            <PerfectScrollbar>
              <div style={{ position: 'relative', height: 'calc(100vh - 240px)' }}>
                <VStack>
                  {types.map((t: string, index: number) => buildItem(t, index + 1))}
                </VStack>
              </div>
            </PerfectScrollbar>
          </Box>
        </VStack>
      </Flex>
    </Layout>
  )
}