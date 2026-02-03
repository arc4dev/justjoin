import { Container } from '@/components/layout/Container/Container'
import { DateDisplay } from '@/components/layout/DateDisplay/DateDisplay'
import { TrainerForm } from '@/features/pokemon-registration'
import { getCurrentDate } from '@/lib/services/date.service'

export default async function Home() {
	// Fetch current date on the server to avoid layout shifts (i hate these)
	const currentDate = await getCurrentDate()

	return (
		<Container>
			<DateDisplay date={currentDate} />
			<TrainerForm />
		</Container>
	)
}
