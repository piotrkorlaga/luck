import { injectable } from 'inversify';
import { IHappening } from './happening.model';
import { Happening } from './happening';
import { HappeningFactory } from './happening.factory';

@injectable()
export class HappeningRepository {

    constructor(private list: IHappening[] = [],
                private happeningFactory: HappeningFactory) {
    }

    public add(happening: IHappening): IHappening {
        this.list.push(happening);

        return happening
    }

    public getByIndex(id: string): Happening {
        const happening = this.list.find((el) => el.id === id);
        return this.happeningFactory.recreate(happening);
    }

    public update(id: string, happening: IHappening): Happening {
        this.list = this.list.reduce((previousValue, currentValue) => {
            currentValue.id === id ? previousValue.push(happening) : previousValue.push(currentValue);

            return previousValue;
        }, []);

        return this.happeningFactory.recreate(happening);
    }
}
