import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import NotesCard from '../notes/NotesCard';
import './HomeAdmin.css';
import Navbar from '../navbar/Navbar';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomeAdmin = () => {
  const [notes, setNotes] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  var totalNotes = 0;
  var noteCtr = 0;
  var notesListShow = null;
  if(notes !== null){
    totalNotes = notes.length;
    notesListShow = notes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    noteCtr = noteCtr*(currentPage-1) + 1;
  }

  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  try {
    useEffect(() => {
      const fetchNotes = async () => {
        const response = await fetch('http://localhost:8080/notes/list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        setNotes(data.obj);

        if(data.status !== 200){
          console.log("false");
          alert(data.msg);
        }

      };
  
      fetchNotes();

    }, [userId]);

  } catch (error) {
    console.error(error);
    alert(error);
  }

  const openAddNotesPage = () => {
    const title = 'Add Note';
    const flag = true;
    localStorage.setItem('addPage', JSON.stringify({ flag }));
    navigate("/home-admin/addnote", {
      state: { title }
    });
  }

  const handlePageChange = (data) => {
    setCurrentPage(data.selected + 1);
  }

  return (
    <div className='home-page'>
      <Navbar />

      <div className='note-list'>
        {notesListShow && notesListShow.map((note) => (
          <NotesCard key={note.id} note={note} ctr={noteCtr++} />
        ))}
      </div>

      <div className='pagination-div'>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageChange}
          pageRangeDisplayed={totalNotes}
          pageCount={Math.ceil(totalNotes / 10)}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          className='pagination-menu'
        />
      </div>

      <div className='fab' onClick={openAddNotesPage} >
        <FaPlus className='fab-ic'/>
      </div>

    </div>
  )
}

export default HomeAdmin