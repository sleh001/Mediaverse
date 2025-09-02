import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { LoadingTrackerEntry } from './LoadingTrackerEntry';
import { UIManager } from './UIManager';
import { Scenario } from '../world/Scenario';
import Swal from 'sweetalert2';
import { World } from '../world/World';

export class LoadingManager
{
	public firstLoad: boolean = true;
	public onFinishedCallback: () => void;
	
	private world: World;
	private gltfLoader: GLTFLoader;
	private loadingTracker: LoadingTrackerEntry[] = [];

	constructor(world: World)
	{
		this.world = world;
		this.gltfLoader = new GLTFLoader();

		this.world.setTimeScale(0);
		UIManager.setUserInterfaceVisible(false);
		UIManager.setLoadingScreenVisible(true);
	}

	public loadGLTF(path: string, onLoadingFinished: (gltf: any) => void): void
	{
		let trackerEntry = this.addLoadingEntry(path);

		this.gltfLoader.load(path,
		(gltf)  =>
		{
			onLoadingFinished(gltf);
			this.doneLoading(trackerEntry);
		},
		(xhr) =>
		{
			if ( xhr.lengthComputable )
			{
				trackerEntry.progress = xhr.loaded / xhr.total;
			}
		},
		(error)  =>
		{
			console.error(error);
		});
	}

	public addLoadingEntry(path: string): LoadingTrackerEntry
	{
		let entry = new LoadingTrackerEntry(path);
		this.loadingTracker.push(entry);

		return entry;
	}

	public doneLoading(trackerEntry: LoadingTrackerEntry): void
	{
		trackerEntry.finished = true;
		trackerEntry.progress = 1;

		if (this.isLoadingDone())
		{
			if (this.onFinishedCallback !== undefined) 
			{
				this.onFinishedCallback();
			}
			else
			{
				UIManager.setUserInterfaceVisible(true);
			}

			UIManager.setLoadingScreenVisible(false);
		}
	}

	// public createWelcomeScreenCallback(scenario: Scenario): void
	// {
	// 	if (this.onFinishedCallback === undefined)
	// 	{
	// 		this.onFinishedCallback = () =>
	// 		{
	// 			this.world.update(1, 1);
	
	// 			Swal.fire({
	// 				title: scenario.descriptionTitle,
	// 				html: scenario.descriptionContent,
	// 				confirmButtonText: 'Play',
	// 				buttonsStyling: false,
	// 				onClose: () => {
	// 					this.world.setTimeScale(1);
	// 					UIManager.setUserInterfaceVisible(true);
	// 				}
	// 			});

	// 		};
	// 	}
	// }
	public createWelcomeScreenCallback(scenario: Scenario): void
{
    if (this.onFinishedCallback === undefined)
    {
        this.onFinishedCallback = () =>
        {
            this.world.update(1, 1);

            // Custom text based on scenario ID
            let title = scenario.descriptionTitle;
            let content = scenario.descriptionContent;

            // Override text for specific scenarios
            if (scenario.name === 'A propos ') { // Replace with actual scenario ID
                title = "A propos de Medianet";
                content = "Nous sommes une agence Digitalement transformée Grâce à son expérience de plus de 20 ans dans le Web, le mobile et le marketing digital, MEDIANET est un accompagnateur dans la transformation digitale 360°";
            }
            else if (scenario.name === 'Culture & Valeurs') { // Replace with actual scenario ID
                title = "Culture & Valeurs";
                content = "Confiance-Transparence-Communication-Partage";
            }
			else if (scenario.name === 'MEDIANET dans le monde') { // Replace with actual scenario ID
                title = "MEDIANET dans le monde";
                content = "Aujourd’hui, MEDIANET est présente sur quatre continents et ne cesse d'accroître son activité à l’échelle internationaleLe Canada, les USA, la France, l'Angleterre, l'Allemagne, l'Italie, la Tunisie, l'Algérie, le Maroc, la Mauritanie, le Sénégal, la Côte d'Ivoire, le Burkina Faso, le Bénin, le Mali, la Guinée, le Gabon, le Congo, le Burundi, le Tchad, la Libye, l'Egypte, l'Arabie Saoudite, le Yémen et les UAE";
            }
			 else if (scenario.name === 'Innovation') { // Replace with actual scenario ID
                title = "MEDIANET Labs";
                content = "Un laboratoire pour développer des projets novateurs à travers l'innovation collective MEDIANET Labs mise sur des Medianautes experts, créatifs et innovants";
            }
			   else if (scenario.name === 'Contact') { // Replace with actual scenario ID
                title = "Contact";
                content = "Avenue Habib Bourguiba, 10 Décembre\nImmeuble Essaadi Tour C-D Mezzanine Menzah 4, 1004 Tunis\nTéléphone : +216 28 910 608\nInformation : info@medianet.com.tn\nCommercial : sales@medianet.com.tn\nRecrutement : recrutement@medianet.com.tn";
			               }            // Add more scenarios as needed

            Swal.fire({
                title: title,
                html: content,
                confirmButtonText: 'Play',
                buttonsStyling: false,
                onClose: () => {
                    this.world.setTimeScale(1);
                    UIManager.setUserInterfaceVisible(true);
                }
            });
        };
    }
}

	private getLoadingPercentage(): number
	{
		let done = true;
		let total = 0;
		let finished = 0;

		for (const item of this.loadingTracker)
		{
			total++;
			finished += item.progress;
			if (!item.finished) done = false;
		}

		return (finished / total) * 100;
	}

	private isLoadingDone(): boolean
	{
		for (const entry of this.loadingTracker) {
			if (!entry.finished) return false;
		}
		return true;
	}
}