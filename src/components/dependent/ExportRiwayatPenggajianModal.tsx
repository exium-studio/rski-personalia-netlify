import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonProps,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  RiArrowDownLine,
  RiBankLine,
  RiHandCoinLine,
  RiUploadLine,
} from "@remixicon/react";
import { useRef, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import download from "../../lib/download";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {
  periode: string;
}

export default function ExportRiwayatPenggajianModal({
  periode,
  ...props
}: Props) {
  // console.log(periode);

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`export-modal-${periode}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const [tipeExport, setTipeExport] = useState<number | undefined>(undefined);

  const handleExport = () => {
    setLoading(true);

    let url = "";
    if (tipeExport === 1) {
      url = "/api/rski/dashboard/keuangan/penggajian/export-penerimaan";
    } else if (tipeExport === 2) {
      url = "/api/rski/dashboard/keuangan/penggajian/export-potongan";
    } else if (tipeExport === 3) {
      url = "/api/rski/dashboard/keuangan/penggajian/export-bank";
    }

    const payload = {
      months: [new Date(periode).getMonth() + 1],
      years: [new Date(periode).getFullYear()],
    };

    req
      .post(url, payload, {
        responseType: "blob", // Penting untuk menangani file biner
      })
      .then((r) => {
        if (r.status === 200) {
          download(r.data, `Laporan Penggajian ${formatDate(periode)}`, "xls");
        } else {
          toast({
            status: "error",
            title: "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        toast({
          status: "error",
          title:
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Maaf terjadi kesalahan pada sistem",
          isClosable: true,
          position: "bottom-right",
        });
      })
      .finally(() => {
        backOnClose();
        setTipeExport(undefined);
        setLoading(false);
      });
  };

  return (
    <>
      <Button
        minW={"120px"}
        className="btn-outline clicky"
        leftIcon={<Icon as={RiUploadLine} fontSize={iconSize} />}
        pl={5}
        onClick={onOpen}
        {...props}
      >
        Export
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          setTipeExport(undefined);
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title={"Export Penggajian"}
              onClose={() => {
                setTipeExport(undefined);
              }}
            />
          </ModalHeader>
          <ModalBody>
            <CContainer gap={2}>
              <Alert status="warning">
                <AlertIcon />
                <AlertDescription>Pilih tipe export dahulu</AlertDescription>
              </Alert>

              <Button
                onClick={() => {
                  setTipeExport(1);
                }}
                justifyContent={"space-between"}
                className={
                  tipeExport === 1 ? "selected clicky" : "btn-outline clicky"
                }
                rightIcon={<Icon as={RiArrowDownLine} fontSize={iconSize} />}
              >
                Penggajian Penerimaan
              </Button>
              <Button
                onClick={() => {
                  setTipeExport(2);
                }}
                justifyContent={"space-between"}
                className={
                  tipeExport === 2 ? "selected clicky" : "btn-outline clicky"
                }
                rightIcon={<Icon as={RiHandCoinLine} fontSize={iconSize} />}
              >
                Penggajian Potongan
              </Button>
              <Button
                onClick={() => {
                  setTipeExport(3);
                }}
                justifyContent={"space-between"}
                className={
                  tipeExport === 3 ? "selected clicky" : "btn-outline clicky"
                }
                rightIcon={<Icon as={RiBankLine} fontSize={iconSize} />}
              >
                Penggajian Bank
              </Button>
            </CContainer>
            {/* 
            {tipeExport && (
              <Text opacity={0.6} mt={responsiveSpacing}>
                Apakah anda yakin akan export tabel ini?
              </Text>
            )} */}
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={() => {
                backOnClose();
                setTipeExport(undefined);
              }}
              isDisabled={loading || !tipeExport}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              isDisabled={!tipeExport}
              isLoading={loading}
              onClick={handleExport}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
