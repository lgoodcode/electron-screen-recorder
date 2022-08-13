import {
  Box,
  FormControl,
  useColorModeValue,
  FormErrorMessage,
  Button,
  Flex,
  Tooltip,
  Input,
  IconButton,
  Icon,
  HStack,
  useToast,
  type BoxProps,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiOutlineFolderOpen } from 'react-icons/ai'

export default function RecordsLocation(props: BoxProps) {
  const [editMode, setEditMode] = useState(false)
  const [isValid, setIsValid] = useState(true)
  // The current path configured
  const [path, setPath] = useState('')
  // Temporary path to be used while editing
  const [newPath, setNewPath] = useState('')

  const toast = useToast({
    status: 'success',
    position: 'top-right',
    isClosable: true,
    containerStyle: {
      transform: 'translateY(32px)',
    },
  })

  const handleSelectDir = async () => {
    const dir = await window.settings.selectRecordingsDir()

    // If cancelled, dir will be empty
    if (dir) {
      setIsValid(true)
      setNewPath(dir)
    }
  }

  const handleSave = () => {
    window.settings.updateRecordingsDir(newPath).then((valid) => {
      setIsValid(valid)

      if (valid) {
        setPath(newPath)
        setEditMode(false)
        toast({ description: 'Updated recordings directory' })
      }
    })
  }

  const handleCancel = () => {
    setEditMode(false)
    setIsValid(true)
    setNewPath(path)
  }

  /**
   * Get the the current path configured in the settings.
   */
  useEffect(() => {
    if (!path) {
      window.settings.getRecordingsDir().then((path) => {
        setPath(path)
        setNewPath(path)
      })
    }
  }, [])

  return (
    <Box className="records-location" {...props}>
      <FormControl borderRadius="md" transition="all 0.3s ease" isInvalid={!isValid}>
        <Input
          px={4}
          disabled={!editMode}
          bg={
            editMode
              ? useColorModeValue('gray.100', 'gray.800')
              : useColorModeValue('gray.200', 'gray.900')
          }
          border="none"
          outline="none"
          color={useColorModeValue('gray.700', 'gray.300')}
          // defaultValue="C:\Users\Lawrence\AppData\Roaming\secure-electron-boilerplate"
          value={!editMode ? path : newPath}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSave()
            }
          }}
          onChange={(e: React.BaseSyntheticEvent) => setNewPath(e.target.value)}
          _disabled={{
            color: useColorModeValue('gray.500', 'gray.400'),
          }}
          _focus={{
            border: 'none',
            boxShadow: 'none',
          }}
        />
        {!isValid && <FormErrorMessage>Invalid path</FormErrorMessage>}
      </FormControl>

      <Box mt={4}>
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>Change</Button>
        ) : (
          <Flex justifyContent="space-between">
            <Tooltip label="Select folder">
              <IconButton
                size="lg"
                icon={<Icon as={AiOutlineFolderOpen} h={6} w={6} />}
                aria-label="Select folder"
                onClick={handleSelectDir}
              />
            </Tooltip>

            <HStack spacing={4}>
              <Button
                color="white"
                bg="green.500"
                onClick={handleSave}
                _hover={{ bg: 'green.600' }}
              >
                Save
              </Button>
              <Button color="white" bg="red.500" onClick={handleCancel} _hover={{ bg: 'red.600' }}>
                Cancel
              </Button>
            </HStack>
          </Flex>
        )}
      </Box>
    </Box>
  )
}
