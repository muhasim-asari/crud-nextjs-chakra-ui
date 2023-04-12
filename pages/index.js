import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  Box,
  Button,
  IconButton,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { EditIcon } from '@chakra-ui/icons'
import { useForm } from "react-hook-form";
import axios from "axios";

const Home = () => {
  const { register, handleSubmit, reset } = useForm();

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDetail, setShowDetail] = useState(null);

  const { isLoading, data, error, refetch } = useQuery("posts", async () => {
    const response = await axios.get("/api");
    return response.data;
  });

  const createMutation = useMutation(
    async (data) => {
      const response = await axios.post("/api", data);
      return response.data;
    },
    {
      onSuccess: () => {
        reset();
        refetch();
      },
    }
  );

  const updateMutation = useMutation(
    async (data) => {
      const response = await axios.put("/api", data);
      return response.data;
    },
    {
      onSuccess: () => {
        reset();
        setEditId(null);
        refetch();
      },
    }
  );

  const handleCreate = (formData) => {
    createMutation.mutate(formData);
  };

  const handleUpdate = (formData) => {
    updateMutation.mutate(formData);
  };

  const handleEdit = (post) => {
    reset(post);
    setEditId(post.id);
  };

  const handleCancelEdit = (formData) => {
    reset(formData);
    setEditId(null);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleShowDetail = (post) => {
    setShowDetail(post);
    onOpen();
  };

  const handleCloseDetail = () => {
    setShowDetail(null);
    onClose();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        CRUD with CHAKRA-UI by Muhammad Hasim As'ari
      </Heading>
      <form onSubmit={handleSubmit(editId ? handleUpdate : handleCreate)}>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Input
              type="text"
              {...register("title")}
              placeholder="Title"
              required
            />
          </Box>
          <Box mr={2} width={96}>
            <Input
              type="text"
              {...register("body")}
              placeholder="Body"
              required
            />
          </Box>
          <Button type="submit">{editId ? "Update" : "Create Post"}</Button>
          {editId && (
            <Button ml={2} onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </Box>
      </form>
      <Table mt={4} variant="striped">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Body</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((post) => (
            <Tr key={post.id}>
              <Td maxWidth={40}>{post.title}</Td>
              <Td maxWidth={96}>{post.body}</Td>
              <Td maxWidth={20}>
                <Button size="sm" mr={2} colorScheme="green" onClick={() => handleShowDetail(post)}>
                  See Detail
                </Button>
                <IconButton
                  onClick={() => handleEdit(post)}
                  variant='outline'
                  colorScheme='orange'
                  size='sm'
                  aria-label='Detail Post'
                  ml={2}
                  icon={<EditIcon />}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {showDetail && (
        <Modal size='lg' blockScrollOnMount={false} isOpen={isOpen} onClose={handleCloseDetail} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text fontSize='xl'>{showDetail.title}</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={2}>
                <Text fontSize='lg'>{showDetail.body}</Text>
              </Stack>
              
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};
export default Home;
