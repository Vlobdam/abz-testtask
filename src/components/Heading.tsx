import { Font } from "./Font"
import styles from "@/styles/Heading.module.scss"
import { PropsWithChildren } from "react"

export const Heading = ({ children }: PropsWithChildren) => (
  <h1 className={styles.heading}>
    <Font>
      { children }
    </Font>
  </h1>
)
