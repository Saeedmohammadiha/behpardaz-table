import axios from 'axios';
import MaterialTable from 'material-table';
import { useEffect, useState } from 'react';
import { Box, Modal, Typography } from '@material-ui/core';
//icons
import {
  Delete,
  Edit,
  LastPage,
  ChevronLeft,
  FirstPage,
  ChevronRight,
  Add,
  Check,
  Clear,
  ArrowDownward,
  Remove,
  ViewColumn,
  SaveAlt,
  FilterList,
} from '@material-ui/icons';
import PersonIcon from '@material-ui/icons/Person';

/**
 * style for modal
 */
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const tableicons = {
  Add: () => <Add />,
  Check: () => <Check />,
  Clear: () => <Clear />,
  Delete: () => <Delete />,
  Edit: () => <Edit />,
  FirstPage: () => <FirstPage />,
  LastPage: () => <LastPage />,
  NextPage: () => <ChevronRight />,
  PreviousPage: () => <ChevronLeft />,
  SortArrow: () => <ArrowDownward />,
  ThirdStateCheck: () => <Remove />,
  ViewColumn: () => <ViewColumn />,
  DetailPanel: () => <ChevronRight />,
  Export: () => <SaveAlt />,
  Filter: () => <FilterList />,
};


function App() {
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState();
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState();
  const [open, setOpen] = useState(false);
  /**
   * columns for table
   */
   const [columns, setColumns] = useState([
    { title: 'First Name', field: 'firstName' },
    { title: 'Last Name', field: 'lastName' },
    { title: 'City', field: 'city' },
    { title: 'Address', field: 'address' },
  ]);

  /**
   * open modal and puts the user's data from the row that clicked
   *
   * @param {{}} event
   * @param {{}} rowData
   */
  const handleOpen = (event, rowData) => {
    setModalData(rowData);
    setOpen(true);
  };

  /**
   * closing modal
   *
   */
  const handleClose = () => setOpen(false);


  /**
   * fetching data from api after monting
   * and everytime that a user is added or edited
   */
  useEffect(() => {
    axios
      .get('https://63581241c27556d289368088.mockapi.io/api/v1/users')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [refresh]);

  return (
    <>
      <MaterialTable
        title="بهپرداز جهان"
        columns={columns}
        data={data}
        isLoading={loading}
        icons={tableicons}
        options={{ search: false }}
        localization={{
          pagination: {
            labelRowsSelect: 'ردیف',
            firstTooltip: 'اولین صفحه',
            previousTooltip: 'صفحه قبل',
            nextTooltip: 'صفحه بعد',
            lastTooltip: 'آخرین صفحه',
          },

          body: {
            emptyDataSourceMessage: 'صبر کنید...',
            addTooltip: 'اضافه کردن',
            editTooltip: 'ویرایش',
            editRow: {
              deleteText: 'آیا این ردیف حذف شود؟',
              saveTooltip: 'ذخیره',
              cancelTooltip: 'انصراف',
            },
          },
        }}
        actions={[
          {
            icon: PersonIcon,
            tooltip: 'جزئیات',
            onClick: handleOpen,
          },
        ]}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setLoading(true);
              axios
                .post(
                  `https://63581241c27556d289368088.mockapi.io/api/v1/users`,
                  newData
                )
                .then((response) => {
                  setRefresh(!refresh);
                  setLoading(false);

                  resolve();
                })
                .catch((error) => {
                  console.log(error.response);
                  setLoading(false);

                  reject();
                });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setLoading(true);
              const editedData = {
                firstName: newData.firstName,
                lastName: newData.lastName,
                city: newData.city,
                address: newData.address,
              };

              axios
                .put(
                  `https://63581241c27556d289368088.mockapi.io/api/v1/users/${newData.id}`,
                  editedData
                )
                .then((response) => {
                  setRefresh(!refresh);
                  setLoading(false);
                  resolve();
                })
                .catch((error) => {
                  console.log(error.response);
                  setLoading(false);
                  reject();
                });
            }),
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Users details
          </Typography>
          <Typography sx={{ mt: 2 }}>
            First Name: {modalData?.firstName}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Last Name: {modalData?.lastName}
          </Typography>
          <Typography sx={{ mt: 2 }}>City: {modalData?.city}</Typography>
          <Typography sx={{ mt: 2 }}>Address: {modalData?.address}</Typography>
          <Typography sx={{ mt: 2 }}>
            Created At: {modalData?.createdAt}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default App;
