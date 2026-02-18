import { Center, HStack, Icon, MenuItem, Text } from "@chakra-ui/react";
import { RiEditLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useDataState from "../../hooks/useDataState";
import isHasPermissions from "../../lib/isHasPermissions";
import isObjectEmpty from "../../lib/isObjectEmpty";
import EditKuotaCutiDisclosure from "../independent/EditKuotaCutiDisclosure";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import TabelFooterConfig from "./TabelFooterConfig";
import formatNumber from "../../lib/formatNumber";

interface Props {
  filterConfig?: any;
}
export default function TabelKuotaHakCuti({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditKuotaCutiDisclosure rowData={rowData}>
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem isDisabled={!editPermission}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditKuotaCutiDisclosure>
      );
    },
  ];

  const { error, loading, notFound, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/pengaturan/get-hak-cuti?page=${pageConfig}`,
      payload: {
        ...formattedFilterKaryawan,
        ...(filterConfig?.status_cuti?.length > 0 && {
          status_cuti: filterConfig.status_cuti.map((sp: any) => sp.value),
        }),
        ...(filterConfig?.tipe_cuti?.length > 0 && {
          tipe_cuti: filterConfig.tipe_cuti.map((sp: any) => sp.value),
        }),
      },
      limit: limitConfig,
      dependencies: [
        limitConfig,
        pageConfig,
        filterConfig,
        formattedFilterKaryawan,
      ],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [formattedFilterKaryawan, filterConfig]);

  const tipeCutiList = data?.[0]?.hak_cuti?.map((hakCuti: any) => ({
    value: hakCuti?.nama,
    th: hakCuti?.nama,
    cProps: {
      justify: "center",
    },
  }));
  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    ...(tipeCutiList ?? []),
  ];
  const formattedData = data?.map((item: any) => {
    const cutiList = item?.hak_cuti?.map((hakCuti: any) => ({
      value: hakCuti?.kuota || 0,
      td: (
        <HStack>
          <Text>{formatNumber(hakCuti?.used_kuota)}</Text>
          <Text opacity={0.4}>/ {formatNumber(hakCuti?.kuota) || "-"}</Text>
          {/* <Text opacity={0.4}>hari</Text> */}
        </HStack>
      ),
      isNumeric: true,
      cProps: {
        justify: "center",
      },
    }));

    return {
      id: item?.id,
      originalData: item,
      columnsFormat: [
        {
          value: item.user.nama,
          td: (
            <AvatarAndNameTableData
              detailKaryawanId={`detail-karyawan-modal-${item.id}-${item.user.id}`}
              data={{
                id: item.user.id,
                nama: item.user.nama,
                foto_profil: item.user?.foto_profil?.path,
              }}
            />
          ),
          props: {
            position: "sticky",
            left: 0,
            zIndex: 2,
          },
          cProps: {
            borderRight: "1px solid var(--divider3)",
          },
        },
        ...(cutiList ?? []),
      ],
    };
  });

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [160]);

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(formattedFilterKaryawan, ["search"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(formattedFilterKaryawan, ["search"]) && (
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

      <TabelFooterConfig
        limitConfig={limitConfig}
        setLimitConfig={setLimitConfig}
        pageConfig={pageConfig}
        setPageConfig={setPageConfig}
        paginationData={paginationData}
        // footer={<Footer>Kuota cuti dalam hari</Footer>}
      />
    </>
  );
}
