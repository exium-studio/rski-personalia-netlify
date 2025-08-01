import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
} from "@remixicon/react";
import { id as ind } from "date-fns/locale";
import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useErrorColor, useWarningColor } from "../../../constant/colors";
import useBackOnClose from "../../../hooks/useBackOnClose";
import backOnClose from "../../../lib/backOnClose";
import countDateRange from "../../../lib/countDateRange";
import formatDate from "../../../lib/formatDate";
import DisclosureHeader from "../DisclosureHeader";
import MonthYearInputModal from "./MonthYearInputModal";
type PrefixOption = "basic" | "basicShort" | "long" | "longShort" | "short";

type PresetConfig = "thisMonth" | "nextMonth" | "thisWeek" | "nextWeek";

interface Props extends ButtonProps {
  id: string;
  name: string;
  onConfirm: (inputValue: { from: Date; to: Date } | undefined) => void;
  inputValue: { from: Date; to: Date } | undefined;
  dateFormatOptions?: PrefixOption | object;
  placeholder?: string;
  nonNullable?: boolean;
  isError?: boolean;
  maxRange?: number;
  presetsConfig?: PresetConfig[];
}

export default function DateRangePickerModal({
  id,
  name,
  onConfirm,
  inputValue,
  dateFormatOptions,
  placeholder,
  nonNullable,
  isError,
  maxRange,
  presetsConfig = ["thisMonth", "thisWeek"],
  ...props
}: Props) {
  const initialRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`${id}-${name}`, isOpen, onOpen, onClose);

  const [date, setDate] = useState<Date>(
    inputValue ? inputValue.from : new Date()
  );
  const [bulan, setBulan] = useState<number>(
    inputValue ? inputValue.from?.getMonth() : date.getMonth()
  );
  const [tahun, setTahun] = useState<number>(
    inputValue ? inputValue.from?.getFullYear() : date.getFullYear()
  );
  const [selected, setSelected] = useState<any>(inputValue);

  function handleSelect(range: any) {
    if (maxRange && countDateRange(range?.from, range?.to) > maxRange) {
      const newTo = new Date(range.from);
      newTo.setDate(newTo.getDate() + maxRange - 1);
      range = { from: range.from, to: newTo };
    }

    setSelected(range);
  }

  function confirmSelected() {
    let confirmable = false;
    if (!nonNullable) {
      confirmable = true;
    } else {
      if (selected) {
        confirmable = true;
      }
    }

    if (confirmable) {
      onConfirm(selected);
      backOnClose();
    }
  }

  function setSelectedToThisWeek() {
    const today = new Date();

    // Get the current day of the week (0 - Sunday, 6 - Saturday)
    const dayOfWeek = today.getDay();

    // Calculate the date of the start of the week (Monday)
    const startOfWeek = new Date(today);
    const dayDiffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // if today is Sunday, set the difference to 6, else subtract 1
    startOfWeek.setDate(today.getDate() - dayDiffToMonday);

    // Calculate the date of the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // 6 days after Monday is Sunday

    // Set the state with the calculated dates
    setDate(today);
    setSelected({ from: startOfWeek, to: endOfWeek });
    setBulan(today.getMonth());
    setTahun(today.getFullYear());
  }
  function setSelectedToNextWeek() {
    const today = new Date();

    // Get the current day of the week (0 - Sunday, 6 - Saturday)
    const dayOfWeek = today.getDay();

    // Calculate the date of the start of the next week (Monday)
    const startOfNextWeek = new Date(today);
    const dayDiffToNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // if today is Sunday, set the difference to 1, else calculate to next Monday
    startOfNextWeek.setDate(today.getDate() + dayDiffToNextMonday);

    // Calculate the date of the end of the next week (Sunday)
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6); // 6 days after Monday is Sunday

    // Set the state with the calculated dates
    setDate(today);
    setSelected({ from: startOfNextWeek, to: endOfNextWeek });
    setBulan(startOfNextWeek.getMonth());
    setTahun(startOfNextWeek.getFullYear());
  }

  function setSelectedToThisMonth() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setDate(today);
    setSelected({ from: startOfMonth, to: endOfMonth });
    setBulan(today.getMonth());
    setTahun(today.getFullYear());
  }
  function setSelectedToNextMonth() {
    const today = new Date();

    // Calculate the date of the start of the next month
    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    // Calculate the date of the end of the next month
    const endOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    );

    // Set the state with the calculated dates
    setDate(today);
    setSelected({ from: startOfNextMonth, to: endOfNextMonth });
    setBulan(startOfNextMonth.getMonth());
    setTahun(startOfNextMonth.getFullYear());
  }

  function nextMonth() {
    const currentMonth = date.getMonth();
    const currentyear = date.getFullYear();

    const nextMonth = new Date(
      bulan === 12 ? currentyear + 1 : tahun,
      bulan === 12 ? 0 : currentMonth + 1
    );
    setDate(nextMonth);
    setBulan(nextMonth.getMonth());
    setTahun(nextMonth.getFullYear());
  }
  function prevMonth() {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const prevMonth = new Date(newYear, newMonth);
    setDate(prevMonth);
    setBulan(prevMonth.getMonth());
    setTahun(prevMonth.getFullYear());
  }

  const renderPresets = {
    thisMonth: (
      <Button
        w={"100%"}
        className="btn-outline clicky"
        onClick={setSelectedToThisMonth}
        isDisabled={!!(maxRange && maxRange < 31)}
      >
        Bulan Ini
      </Button>
    ),
    nextMonth: (
      <Button
        w={"100%"}
        className="btn-outline clicky"
        onClick={setSelectedToNextMonth}
        isDisabled={!!(maxRange && maxRange < 31)}
      >
        Bulan Depan
      </Button>
    ),
    thisWeek: (
      <Button
        w={"100%"}
        className="btn-outline clicky"
        onClick={setSelectedToThisWeek}
        isDisabled={!!(maxRange && maxRange < 7)}
      >
        Minggu Ini
      </Button>
    ),
    nextWeek: (
      <Button
        w={"100%"}
        className="btn-outline clicky"
        onClick={setSelectedToNextWeek}
        isDisabled={!!(maxRange && maxRange < 7)}
      >
        Minggu Depan
      </Button>
    ),
  };

  // SX
  const errorColor = useErrorColor();
  const warningColor = useWarningColor();

  return (
    <>
      <Tooltip
        label={`${
          inputValue?.from
            ? `${formatDate(inputValue.from, "basicShort")}`
            : "Pilih tanggal awal"
        } - ${
          inputValue?.to
            ? `${formatDate(inputValue.to, "basicShort")}`
            : "Pilih tanggal akhir"
        } ${
          inputValue && inputValue.from && inputValue.to
            ? `(${countDateRange(inputValue.from, inputValue.to)} hari)`
            : ""
        }`}
        openDelay={500}
      >
        <Button
          className="btn-clear"
          w={"100%"}
          justifyContent={"space-between"}
          borderRadius={8}
          border={"1px solid var(--divider3)"}
          boxShadow={isError ? `0 0 0px 1px ${errorColor}` : ""}
          px={"16px !important"}
          h={"40px"}
          fontWeight={400}
          cursor={"pointer"}
          onClick={() => {
            onOpen();
            setSelected(inputValue);
            setDate(inputValue ? inputValue.from : new Date());
            setBulan(
              inputValue ? inputValue.from?.getMonth() : new Date().getMonth()
            );
            setTahun(
              inputValue
                ? inputValue.from?.getFullYear()
                : new Date().getFullYear()
            );
          }}
          // _focus={{ boxShadow: "0 0 0px 2px var(--p500)" }}
          {...props}
        >
          {inputValue ? (
            <Text
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              mr={4}
            >{`${
              inputValue?.from
                ? `${formatDate(inputValue.from, "basicShort")}`
                : "Pilih tanggal awal"
            } - ${
              inputValue?.to
                ? `${formatDate(inputValue.to, "basicShort")}`
                : "Pilih tanggal akhir"
            } ${
              inputValue && inputValue.from && inputValue.to
                ? `(${countDateRange(inputValue.from, inputValue.to)} hari)`
                : ""
            }`}</Text>
          ) : (
            <Text
              //@ts-ignore
              color={props?._placeholder?.color || "#96969691"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              mr={4}
            >
              {placeholder || `Pilih Rentang Tanggal`}
            </Text>
          )}

          <Icon as={RiCalendarLine} />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={0} ref={initialRef}>
            <DisclosureHeader title={placeholder || "Pilih Rentang Tanggal"} />
          </ModalHeader>

          <ModalBody className="scrollY">
            <VStack gap={0} overflowY={"auto"} w={"100%"} align={"stretch"}>
              {maxRange && (
                <Alert
                  status="warning"
                  borderRadius={"6px !important"}
                  py={"8px !important"}
                  mb={4}
                  flexShrink={0}
                >
                  <Text color={warningColor} w={"100%"} align={"center"}>
                    Maksimal rentang tanggal <b>{maxRange}</b> hari
                  </Text>
                </Alert>
              )}

              <ButtonGroup w={"100%"} mb={3}>
                <Button
                  aria-label="Previous Month"
                  leftIcon={
                    <Icon
                      className="iconButton"
                      as={RiArrowLeftSLine}
                      fontSize={20}
                    />
                  }
                  pr={"18px"}
                  className="btn-outline clicky"
                  onClick={prevMonth}
                  w={"100%"}
                  maxW={"50px"}
                ></Button>

                <MonthYearInputModal
                  id={"date_range_picker_input_month_year_drawer"}
                  name="set-month-year"
                  bulan={bulan}
                  tahun={tahun}
                  setBulan={setBulan}
                  setTahun={setTahun}
                  setDate={setDate}
                />

                <Button
                  aria-label="Next Month"
                  rightIcon={<Icon as={RiArrowRightSLine} fontSize={20} />}
                  pl={"18px"}
                  className="btn-outline clicky"
                  onClick={nextMonth}
                  w={"100%"}
                  maxW={"50px"}
                ></Button>
              </ButtonGroup>

              <DayPicker
                mode="range"
                selected={selected}
                onSelect={handleSelect}
                locale={ind}
                month={date}
                showOutsideDays
                fixedWeeks
                disableNavigation
              />

              <VStack mt={4}>
                <ButtonGroup w={"100%"}>
                  {presetsConfig.map((preset, i) => (
                    <Box w={"100%"} key={i}>
                      {renderPresets[preset]}
                    </Box>
                  ))}
                </ButtonGroup>

                <HStack w={"100%"} position={"relative"}>
                  <Box flex={1}>
                    <VStack
                      borderRadius={8}
                      bg={"var(--divider)"}
                      p={2}
                      gap={1}
                    >
                      <Text
                        textAlign={"center"}
                        opacity={selected?.from ? 1 : 0.6}
                        // color={selected?.from && selected?.to && "p.500"}
                        fontWeight={selected?.from && selected?.to && "600"}
                      >
                        {`${
                          selected?.from
                            ? `${formatDate(selected.from, "basicShort")}`
                            : "Pilih tanggal awal"
                        } - ${
                          selected?.to
                            ? `${formatDate(selected.to, "basicShort")}`
                            : "Pilih tanggal akhir"
                        } ${
                          selected && selected.from && selected.to
                            ? `(${countDateRange(
                                selected.from,
                                selected.to
                              )} hari)`
                            : ""
                        }`}
                      </Text>
                    </VStack>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={() => {
                setSelected(undefined);
              }}
            >
              Clear
            </Button>

            <Button
              mt={2}
              colorScheme="ap"
              className="btn-ap clicky"
              w={"100%"}
              isDisabled={
                nonNullable
                  ? selected && selected.from && selected.to
                    ? false
                    : true
                  : (selected && selected.from && selected.to) ||
                    selected === undefined
                  ? false
                  : true
              }
              onClick={confirmSelected}
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
