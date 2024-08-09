import {
  Box,
  Center,
  HStack,
  StackProps,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useBodyColor } from "../../constant/colors";
import {
  dashboardItemHeight,
  dashboardItemMinWidth,
  responsiveSpacing,
} from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import ChartDoughnut from "../dependent/ChartDoughnut";
import Skeleton from "./Skeleton";
import Retry from "../dependent/Retry";
import NoData from "./NoData";

interface Props extends StackProps {}

export default function DashboardJenisKelamin({ ...props }: Props) {
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/calculated-jenis-kelamin`,
    dependencies: [],
  });

  const labels = ["Pria", "Wanita"];
  const datasets = [
    {
      label: "Persentase (%)",
      data: [data?.persen_laki_laki, data?.persen_perempuan],
      backgroundColor: ["#FBD38D", "#805AD5"],
      borderWidth: 0,
    },
  ];

  // SX
  const bodyColor = useBodyColor();

  return (
    <>
      {error && (
        <>
          {notFound && <NoData minH={"300px"} />}

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
            <Skeleton
              flex={"1 1 0"}
              borderRadius={12}
              h={dashboardItemHeight}
              minW={dashboardItemMinWidth}
            />
          )}

          {!loading && data && (
            <VStack
              align={"stretch"}
              bg={bodyColor}
              borderRadius={12}
              minW={dashboardItemMinWidth}
              p={responsiveSpacing}
              gap={0}
              h={dashboardItemHeight}
              {...props}
            >
              <Text fontWeight={600}>Jenis Kelamin</Text>
              <Text fontSize={14} opacity={0.6}>
                Karyawan saat ini
              </Text>

              <Wrap m={"auto"} spacing={responsiveSpacing}>
                <VStack
                  flex={"1 1 0"}
                  my={responsiveSpacing}
                  position={"relative"}
                >
                  <VStack w={"100%"} className="doughnutChartContainer">
                    <ChartDoughnut labels={labels} datasets={datasets} />
                  </VStack>

                  <Text
                    position={"absolute"}
                    left={"50%"}
                    top={"50%"}
                    transform={"translate(-50%, -50%)"}
                    fontSize={48}
                    opacity={0.6}
                  >
                    %
                  </Text>
                </VStack>

                <VStack
                  flex={"1 1 0"}
                  align={"stretch"}
                  justify={"center"}
                  maxW={"240px"}
                  mx={"auto"}
                >
                  <HStack gap={4}>
                    <Box
                      borderRadius={"full"}
                      w={"10px"}
                      h={"10px"}
                      bg={"orange.200"}
                    />

                    <Text>Pria</Text>

                    <Text pl={2} ml={"auto"}>
                      {data.persen_laki_laki}%
                    </Text>
                  </HStack>

                  <HStack gap={4}>
                    <Box
                      borderRadius={"full"}
                      w={"10px"}
                      h={"10px"}
                      bg={"purple.400"}
                    />

                    <Text>Wanita</Text>

                    <Text pl={2} ml={"auto"}>
                      {data.persen_perempuan}%
                    </Text>
                  </HStack>
                </VStack>
              </Wrap>
            </VStack>
          )}
        </>
      )}
    </>
  );
}
