import Image from "next/image";

export default function AudioIcon({ audioUrl }: { audioUrl: string }) {
  const audio = new Audio(audioUrl);
  return (
    <Image
      width={25}
      height={25}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADgUlEQVR4nO2ZW4hNURjHfzNnMOMWoyiMzIPcZh6laKYhl6GQJy/yoEjIA0nIFJkoo4ykpDy4yyUkIQ8UycMMIbfIzBDGzFDIYJjR0ren1Wmtffbl3Hadr87DWf9vfXv/1l57rW99G3KWs0hZDNgCNAFfgINAHyJmfYGLQE/cr5aIQVySG/8EzAKmyv8WIgpRLu350vbXZ7yxZBiiFSiL053p5dXWiP8NYAJZAhEEZIrEUn1+AzXyZNPyYrdq0yksiLIhQD3QJX2vAkNJw5OY7OIbBMSxSu3pPASKSRHExwQQYUGUjQYeSYz7wGBSADHJQ59EICrmTeAUUGLxGQE8lzhqOucFvP/AEF5ABgHt4vMVWGLxU5Bt4reWNEN4nVpjgMvi1w1stvgtEL0TKCUExAdgos/+ft6RjbJ5uo36EdGP6Y1Fssx9NuRH8b8gEH5BlK2QUf8DTMP88v8Q4N4lf78HgDAQQVetPdLnFdDPoO8T/YDT0CENcywBW0SfTnCLBxkA7ASWyYywTecn0m+dQS8TrV18ey9SaAnYLXp+EkFmaG3NQJWl3yLxeWu5foPo1V5Awm5mphjqppYDz7R8aq6hn9orXovPTIO+S7QdmQLRT5KHtNR/mMGnVvQ6g7ZYtOuZBnFG/Y7oNQa9WrTbBq1Um54ZB1E2X/RGy1KrtHcGbaBo37IFZLjo3w1akWhq3zDZTyd2DiQFU6vBkihGYmqpl/2u6NsM+jzRbrm87E3ZsPwe1pbfYpflV6UstuX3WiY3xJXaQekXMDvBhmja/XeLtj0bUpQ3QEWCFKXZcv1GPUXp0P+4JI2VSQQpkqRxqSWzjU8aTeeSctHanKSx3mMar1cP/VqQ6VknfV5aYJ37VseQ/1YouX1HCmGCHqy6pHZsWpI75WBlKgj6ruumAmSDnAx7ZEFwO+oeJWRV0S+MF5BRWnw10ustfgu14kPgQreCuRAAJhFITCozPfJhSO0PtkqLUw5aTUhTX57O+4Tx8kSOAyeAkS4FuhcSRw1mUkzBnPMBE3ZTLQEeS4x7UtAjmTBnPcKEAanSitgPUlWRj8mUSASTjM8KV6QtZVYAnEkA4xekUnsKKg/bGrZo7QfmtAuMX5AaragwnjRbgXwWiIfpr42sn1jjyKCpd+akBlOhnf6eEjGLSeoQn6dtIoKWB6ySp/Ae2CvTJWc5I2L2D/5AteS9AXNgAAAAAElFTkSuQmCC"
      alt="high-volume--v1"
      className="cursor-pointer"
      onClick={() => audio.play()}
    />
  );
}
