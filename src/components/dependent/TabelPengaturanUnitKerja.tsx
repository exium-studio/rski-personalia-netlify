import { Center, Icon, MenuItem, Text } from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiHistoryLine } from "@remixicon/react";
import { Interface__SelectOption } from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import isObjectEmpty from "../../lib/isObjectEmpty";
import EditUnitKerjaModalDisclosure from "../independent/EditUnitKerjaModalDisclosure";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import DeleteDataPengaturanModalDisclosure from "./DeleteDataPengaturanModalDisclosure";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import RestoreDataPengaturanModalDisclosure from "./RestoreDataPengaturanModalDisclosure";
import Retry from "./Retry";
import StatusDihapus from "./StatusDihapus";
import TabelElipsisText from "./TabelElipsisText";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../wrapper/PermissionTooltip";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanUnitKerja({ filterConfig }: Props) {
  // SX
  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [66]);
  const deletePermission = isHasPermissions(userPermissions, [67]);

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditUnitKerjaModalDisclosure rowData={rowData}>
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem isDisabled={!editPermission}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditUnitKerjaModalDisclosure>
      );
    },
    (rowData: any) => {
      return (
        <RestoreDataPengaturanModalDisclosure
          id={rowData.id}
          url={`/api/rski/dashboard/pengaturan/unit-kerja/restore`}
        >
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem
              isDisabled={!rowData.columnsFormat[1].value || !editPermission}
            >
              <Text>Restore</Text>
              <Icon as={RiHistoryLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </RestoreDataPengaturanModalDisclosure>
      );
    },
    "divider",
    (rowData: any) => {
      return (
        <DeleteDataPengaturanModalDisclosure
          id={rowData.id}
          url={`/api/rski/dashboard/pengaturan/unit-kerja`}
        >
          <PermissionTooltip permission={deletePermission} placement="left">
            <MenuItem
              fontWeight={500}
              isDisabled={rowData.columnsFormat[1].value || !deletePermission}
            >
              <Text color={"red.400"}>Delete</Text>
              <Icon
                color={"red.400"}
                as={RiDeleteBinLine}
                fontSize={iconSize}
              />
            </MenuItem>
          </PermissionTooltip>
        </DeleteDataPengaturanModalDisclosure>
      );
    },
  ];

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengaturan/unit-kerja`,
    dependencies: [],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();
    const isDeletedTerm = filterConfig?.is_deleted?.map(
      (term: Interface__SelectOption) => term.value
    );

    const matchesSearchTerm = item.nama_unit.toLowerCase().includes(searchTerm);
    const matchesIsDeletedTerm =
      isDeletedTerm?.includes(1) && isDeletedTerm?.includes(0)
        ? true
        : isDeletedTerm?.includes(1)
        ? !!item.deleted_at
        : isDeletedTerm?.includes(0)
        ? !item.deleted_at
        : true;

    return matchesSearchTerm && matchesIsDeletedTerm;
  });

  const formattedHeader = [
    {
      th: "Nama Unit Kerja",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 3,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Status Dihapus",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jenis Karyawan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Kategori Unit Kerja",
      isSortable: true,
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama_unit,
        td: <TabelElipsisText data={item.nama_unit} />,
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: item.deleted_at,
        td: item.deleted_at ? <StatusDihapus data={item.deleted_at} /> : "",
        isDate: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.jenis_karyawan,
        td: <JenisKaryawanBadge data={item.jenis_karyawan} />,
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.kategori_unit?.label,
        td: item.kategori_unit?.label,
        originalData: item?.kategori_unit,
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig) && <NoData minH={"300px"} />}

          {notFound && !isObjectEmpty(filterConfig) && (
            <NotFound minH={"300px"} />
          )}

          {!notFound && (
            <Center my={"auto"} minH={"300px"}>
              <Retry loading={loading} retry={retry} />
            </Center>
          )}
        </>
      )}

      {!error && (
        <>
          {loading && (
            <>
              <Skeleton minH={"300px"} flex={1} mx={"auto"} />
            </>
          )}
          {!loading && (
            <>
              {!formattedData && <NoData minH={"300px"} />}

              {formattedData && (
                <>
                  {fd && fd?.length === 0 && <NotFound minH={"300px"} />}

                  {fd && fd?.length > 0 && (
                    <>
                      <CustomTableContainer>
                        <CustomTable
                          formattedHeader={formattedHeader}
                          formattedData={formattedData}
                          rowOptions={rowOptions}
                        />
                      </CustomTableContainer>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
