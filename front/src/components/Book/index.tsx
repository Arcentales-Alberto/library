import { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";

import { AddItemDialog } from "../AddItemDialog";
import { BorrowModal } from "../BorrowModal";
import { IBook } from "./interfaces";
import { bookService } from "../../services";
import { EditItemDialog } from "../EditItemDialog";
import { Alert } from "../Alert";
import { NotFoundImage } from "../NotFoundImage";

export const Book = () => {
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [books, setBooks] = useState<IBook[] | undefined>(undefined);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState<boolean>(false);
  const [isAddingBook, setIsAddingBook] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBook, setEditBook] = useState<IBook | null>(null);
  const [showAlert, setShowAlert] = useState<string | boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await bookService.getAll();
      if (response.success) {
        setBooks(response.data);
      } else if (response.status === 404) {
        setBooks([]);
      } else {
        setShowAlert(response.error || "Error inesperado");
      }
    } catch (error) {
      setShowAlert("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveNewBook = async (newBook: IBook) => {
    try {
      const response = await bookService.create(newBook);
      if (response.success) {
        fetchData();
      } else {
        setShowAlert("No se pudo agregar");
      }
    } catch (error) {
      setShowAlert("Hubo un error. Intentarlo más tarde");
    }
    handleCloseAddBookDialog();
  };

  const handleEdit = (book: IBook) => {
    setEditBook(book);
    setIsEditing(true);
  };

  const handleSaveEdit = async (editedBook: IBook) => {
    try {
      const response = await bookService.update(editedBook._id, editedBook);
      if (response.success) {
        fetchData();
      } else {
        setShowAlert("No se pudo actualizar");
      }
    } catch (error) {
      setShowAlert("Hubo un error. Intentarlo más tarde");
    }
    setIsEditing(false);
  };

  const handleDelete = async (_id: string) => {
    try {
      const response = await bookService.delete(_id);
      if (response.success) {
        fetchData();
      } else {
        setShowAlert("No se pudo eliminar");
      }
    } catch (error) {
      setShowAlert("Hubo un error. Intentarlo más tarde");
    }
  };

  const handleOpenAddBookDialog = () => {
    setIsAddingBook(true);
  };

  const handleCloseAddBookDialog = () => {
    setIsAddingBook(false);
  };

  const openBorrowModal = (book: IBook) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  const closeBorrowModal = () => {
    setIsBorrowModalOpen(false);
  };

  const handleBookBorrowed = async () => {
    fetchData();
  };

  return (
    <Container>
      <Button
        variant="contained"
        color="success"
        onClick={handleOpenAddBookDialog}
        style={{ marginBottom: "20px" }}
      >
        Agregar libro
      </Button>
      {!isLoading && !books?.length && <NotFoundImage/>}
      {!isLoading && books && books.length > 0 && (
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Autor</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Préstamo externo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books?.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.stock}</TableCell>
                    <TableCell>{book.externalBorrow.toUpperCase()}</TableCell>
                    <TableCell>
                      <Button
                        disabled={book.stock ? false : true}
                        variant="contained"
                        color="secondary"
                        onClick={() => openBorrowModal(book)}
                        sx={{ marginRight: 2 }}
                      >
                        Prestar
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleEdit(book)}
                        sx={{ marginRight: 2 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(book._id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )}
      <AddItemDialog
        open={isAddingBook}
        onClose={handleCloseAddBookDialog}
        onSave={handleSaveNewBook}
        title="Agregar libro"
        fields={[
          { label: "Título", value: "title" },
          { label: "Autor", value: "author" },
          { label: "Categoría", value: "category" },
          { label: "ISBN", value: "isbn" },
          { label: "Cantidad", value: "stock" },
          { label: "Préstamo externo", value: "externalBorrow" },
        ]}
      />
      <EditItemDialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveEdit}
        title="Editar libro"
        fields={[
          { label: "Título", value: "title" },
          { label: "Autor", value: "author" },
          { label: "Categoría", value: "category" },
          { label: "Cantidad", value: "stock" },
        ]}
        initialData={editBook}
      />
      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={closeBorrowModal}
        selectedBook={selectedBook}
        onBookBorrowed={handleBookBorrowed}
      />
      {showAlert && typeof showAlert === "string" && (
        <Alert message={showAlert} onClose={() => setShowAlert(false)} />
      )}
    </Container>
  );
};
