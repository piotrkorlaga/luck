import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import IDENTIFIER from './identifiers';
import { RelationMemberHappeningRepository } from './relation-member-happening/relation-member-happening.repository';
import { MemberRepository } from './member/member.repository';
import { HappeningRepository } from './happening/happening.repository';
import { HappeningFactory } from './happening/happening.factory';
import { MatchingMemberService } from './member/matching-member.service';
import { UuidGenerationService } from './member/uuid-generation.service';
import { RelationMemberHappeningFactory } from './relation-member-happening/relation-member-happening.factory';
import { MemberFactory } from './member/member.factory';
import { Happening } from './happening/happening';
import { Member } from './member/member';
import { RelationMemberHappeningService } from './relation-member-happening/relation-member-happening.service';
import { RelationMemberHappeningApi } from './relation-member-happening/relation-member-happening.api';
import { IMember } from './member/member.model';
import { IHappening } from './happening/happening.model';
import { RelationMemberHappening } from './relation-member-happening/relation-member-happening';
import { IRelationMemberHappening } from './relation-member-happening/relation-member-happening.model';

const DIContainerProvider = (MEMBER_INITIAL_LIST_MOCK?, HAPPENING_INITIAL_LIST_MOCK?): Container => {
    const DIContainer = new Container();


    DIContainer.bind<RelationMemberHappeningRepository>(IDENTIFIER.RelationMemberHappeningRepository)
        .toDynamicValue((context: interfaces.Context) => {
            const relationMemberHappeningFactory = context
                .container.get<RelationMemberHappeningFactory>(IDENTIFIER.RelationMemberHappeningFactory);

            return new RelationMemberHappeningRepository(
                [],
                relationMemberHappeningFactory)
        }).inSingletonScope();

    DIContainer.bind<MemberRepository>(IDENTIFIER.MemberRepository)
        .toConstantValue(new MemberRepository(
            MEMBER_INITIAL_LIST_MOCK
        ));

    DIContainer.bind<MatchingMemberService>(IDENTIFIER.MatchingMemberService).to(MatchingMemberService);
    DIContainer.bind<UuidGenerationService>(IDENTIFIER.UuidGenerationService).to(UuidGenerationService);

    DIContainer.bind<RelationMemberHappeningFactory>(IDENTIFIER.RelationMemberHappeningFactory)
        .toDynamicValue((context: interfaces.Context) => {
            const uuidGenerationService = context.container.get<UuidGenerationService>(IDENTIFIER.UuidGenerationService);
            const DIFactoryRelationMemberHappening = context
                .container.get<(option: IRelationMemberHappening) => RelationMemberHappening>(IDENTIFIER.DIFactoryRelationMemberHappening);

            return new RelationMemberHappeningFactory(
                uuidGenerationService,
                DIFactoryRelationMemberHappening
            )
        });

    DIContainer.bind<MemberFactory>(IDENTIFIER.MemberFactory)
        .toDynamicValue((context: interfaces.Context) => {
            const uuidGenerationService = context.container.get<UuidGenerationService>(IDENTIFIER.UuidGenerationService);
            const DIFactoryMember = context.container.get<(option: IMember) => Member>(IDENTIFIER.DIFactoryMember);

            return new MemberFactory(
                uuidGenerationService,
                DIFactoryMember
            )
        });

    DIContainer.bind <(option: IHappening) => Happening>(IDENTIFIER.DIFactoryHappening)
        .toFactory<Happening>((context) => {
            return ({ id, name, description, isPublish }: IHappening) => {
                const memberRepository = context.container.get<MemberRepository>(IDENTIFIER.MemberRepository);
                const relationMemberHappeningRepository = context
                    .container.get<RelationMemberHappeningRepository>(IDENTIFIER.RelationMemberHappeningRepository);

                const matchingMemberService = context.container.get<MatchingMemberService>(IDENTIFIER.MatchingMemberService);
                const relationMemberHappeningFactory = context
                    .container.get<RelationMemberHappeningFactory>(IDENTIFIER.RelationMemberHappeningFactory);

                const memberFactory = context.container.get<MemberFactory>(IDENTIFIER.MemberFactory);

                return new Happening(
                    id,
                    name,
                    description,
                    isPublish,
                    memberRepository,
                    relationMemberHappeningRepository,
                    matchingMemberService,
                    relationMemberHappeningFactory,
                    memberFactory);
            };
        });

    DIContainer.bind <(option: IMember) => Member>(IDENTIFIER.DIFactoryMember)
        .toFactory<Member>((context) => {
            return ({ id, relationId, name, uniqueLink, matchedMemberId }: IMember) => {

                return new Member(
                    id,
                    relationId,
                    name,
                    uniqueLink,
                    matchedMemberId);
            };
        });

    DIContainer.bind <(option: IRelationMemberHappening) => RelationMemberHappening>(IDENTIFIER.DIFactoryRelationMemberHappening)
        .toFactory<RelationMemberHappening>((context) => {
            return ({ id, memberId, happeningId }: IRelationMemberHappening) => {
                const memberRepository = context.container.get<MemberRepository>(IDENTIFIER.MemberRepository);
                const happeningRepository = context.container.get<HappeningRepository>(IDENTIFIER.HappeningRepository);

                return new RelationMemberHappening(
                    id,
                    memberId,
                    happeningId,
                    memberRepository,
                    happeningRepository
                );
            };
        });

    DIContainer.bind<HappeningFactory>(IDENTIFIER.HappeningFactory)
        .toDynamicValue((context: interfaces.Context) => {
            const uuidGenerationService = context.container.get<UuidGenerationService>(IDENTIFIER.UuidGenerationService);
            const DIFactoryHappening = context.container.get<(option: IHappening) => Happening>(IDENTIFIER.DIFactoryHappening);

            return new HappeningFactory(
                uuidGenerationService,
                DIFactoryHappening
            )
        });

    DIContainer.bind<HappeningRepository>(IDENTIFIER.HappeningRepository)
        .toDynamicValue((context: interfaces.Context) => {
            const happeningFactory = context.container.get<HappeningFactory>(IDENTIFIER.HappeningFactory);

            return new HappeningRepository(
                HAPPENING_INITIAL_LIST_MOCK,
                happeningFactory);
        }).inSingletonScope();

    DIContainer.bind<RelationMemberHappeningService>(IDENTIFIER.RelationMemberHappeningService)
        .toDynamicValue((context: interfaces.Context) => {
            const relationMemberHappeningRepository = context
                .container.get<RelationMemberHappeningRepository>(IDENTIFIER.RelationMemberHappeningRepository);

            const happeningFactory = context.container.get<HappeningFactory>(IDENTIFIER.HappeningFactory);
            const happeningRepository = context.container.get<HappeningRepository>(IDENTIFIER.HappeningRepository);
            const relationMemberHappeningFactory = context
                .container.get<RelationMemberHappeningFactory>(IDENTIFIER.RelationMemberHappeningFactory);

            return new RelationMemberHappeningService(
                relationMemberHappeningRepository,
                happeningRepository,
                happeningFactory,
                relationMemberHappeningFactory);
        });

    DIContainer.bind<RelationMemberHappeningApi>(IDENTIFIER.RelationMemberHappeningApi)
        .toDynamicValue((context: interfaces.Context) => {
            const relationMemberHappeningService = context
                .container.get<RelationMemberHappeningService>(IDENTIFIER.RelationMemberHappeningService);

            return new RelationMemberHappeningApi(relationMemberHappeningService);
        });

    return DIContainer;
};

export { DIContainerProvider };
