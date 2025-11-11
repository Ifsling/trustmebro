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
  onConfirm: (stake: number) => Promise<void>
  maxStake: number
}

export default function BidModal({
  open,
  onClose,
  onConfirm,
  maxStake,
}: Props) {
  const [stake, setStake] = useState(10)
  const teaserMult = useMemo(
    () => +(6.2 + Math.random() * (11.8 - 6.2)).toFixed(1),
    [open]
  )
  const preview = Math.round(stake * teaserMult)
  const valid = stake > 0 && stake <= maxStake

  return (
    <Modal isOpen={open} onOpenChange={onClose} hideCloseButton>
      <ModalContent>
        <ModalHeader>Enter your bid</ModalHeader>
        <ModalBody>
          <div className="text-xs text-foreground/60 mb-1">
            Available: {maxStake}
          </div>
          <Input
            type="number"
            min={1}
            max={maxStake}
            value={String(stake)}
            onChange={(e) => {
              const v = Math.max(
                1,
                Math.min(Number(e.target.value || 0), maxStake)
              )
              setStake(v)
            }}
            label="Tokens to bid"
          />
          <div className="mt-2 text-lg font-semibold">
            Potential return: ${preview.toLocaleString()}
          </div>
          {!valid && (
            <div className="text-xs text-danger">Stake exceeds balance.</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="warning"
            isDisabled={!valid}
            onPress={async () => {
              await onConfirm(stake)
            }}
          >
            Start game
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
