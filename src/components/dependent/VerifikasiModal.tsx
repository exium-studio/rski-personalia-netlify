import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import useBackOnClose from "../../hooks/useBackOnClose";
import { useState } from "react";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import { useFormik } from "formik";
import * as yup from "yup";
import req from "../../lib/req";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import RequiredForm from "../form/RequiredForm";
import Textarea from "./input/Textarea";

interface Props extends ButtonProps {
  id: string;
  submitUrl: string;
}

export default function VerifikasiModal({ id, submitUrl, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(id, isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const [verifikasi, setVerifikasi] = useState<number | undefined>(undefined);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      verifikasi: undefined as number | undefined,
      alasan: "",
    },
    validationSchema: yup.object().shape({
      verifikasi: yup.number().required("Harus diisi"),
      alasan:
        verifikasi === 0 ? yup.string().required("Harus diisi") : yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      let payload;

      const payload1 = {
        verifikasi_disetujui: 1,
      };
      const payload2 = {
        verifikasi_ditolak: 1,
        alasan: values.alasan,
      };
      if (values.verifikasi === 1) {
        payload = payload1;
      } else {
        payload = payload2;
      }

      req
        .post(submitUrl, payload)
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              position: "bottom-right",
              isClosable: true,
            });
            setRt(!rt);
            backOnClose();
          }
        })
        .catch((e) => {
          console.log(e);
          toast({
            status: "error",
            title:
              e.response.data.message || "Maaf terjadi kesalahan pada sistem",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        {...props}
      >
        Verifikasi
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title={"Konfirmasi Permintaan"}
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form
              id="verifikasiPermintaanPerubahanDataForm"
              onSubmit={formik.handleSubmit}
            >
              <FormControl isInvalid={!!formik.errors.verifikasi}>
                <FormLabel>
                  Verifikasi
                  <RequiredForm />
                </FormLabel>
                <SimpleGrid columns={[1, 2]} gap={2}>
                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={formik.values.verifikasi === 1 ? "green" : ""}
                    variant={formik.values.verifikasi === 1 ? "outline" : ""}
                    onClick={() => {
                      formik.setFieldValue("verifikasi", 1);
                      formik.setFieldValue("alasan", "");
                      setVerifikasi(1);
                    }}
                  >
                    Disetujui
                  </Button>
                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={formik.values.verifikasi === 0 ? "red" : ""}
                    variant={formik.values.verifikasi === 0 ? "outline" : ""}
                    onClick={() => {
                      formik.setFieldValue("verifikasi", 0);
                      setVerifikasi(0);
                    }}
                  >
                    Ditolak
                  </Button>
                </SimpleGrid>
                <FormErrorMessage>
                  {formik.errors.verifikasi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!formik.errors.alasan}>
                <FormLabel>
                  Alasan
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="alasan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("alasan", input);
                  }}
                  inputValue={formik.values.alasan}
                  isDisabled={formik.values.verifikasi !== 0}
                />
                <FormErrorMessage>
                  {formik.errors.alasan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              isLoading={loading}
              type="submit"
              form="verifikasiPermintaanPerubahanDataForm"
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
