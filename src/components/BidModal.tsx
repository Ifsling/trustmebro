"use client"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react"
import { useMemo, useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
  // must return a Promise
  onConfirm: (stake: number, teaserMult: number) => Promise<void>
}

export default function BidModal({ open, onClose, onConfirm }: Props) {
  const [stake, setStake] = useState(10)
  // fresh teaser multiplier per open
  const teaserMult = useMemo(
    () => +(6.2 + Math.random() * (11.8 - 6.2)).toFixed(1),
    [open]
  )
  const preview = Math.round(stake * teaserMult)

  return (
    <Modal isOpen={open} onOpenChange={onClose} hideCloseButton>
      <ModalContent>
        <ModalHeader>Enter your bid</ModalHeader>
        <ModalBody>
          <Input
            type="number"
            min={1}
            value={String(stake)}
            onChange={(e) => setStake(Math.max(1, Number(e.target.value)))}
            label="Tokens to bid"
          />
          <div className="mt-2 text-lg font-semibold">
            Potential return: ${preview.toLocaleString()}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="warning"
            onPress={async () => {
              await onConfirm(stake, teaserMult) // returns Promise<void>
            }}
          >
            Start game
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
